import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ARENA_MUTATION, SEND_MESSAGE_MUTATION } from '@/queries/chat';
import { Loader2, Zap, Swords, User, Trophy, Play } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ArenaProps {
    groupId: string;
    members: any[];
    currentUser: any;
}

type GameState = 'setup' | 'playing' | 'result';

export function Arena({ groupId, members, currentUser }: ArenaProps) {
    const [gameState, setGameState] = useState<GameState>('setup');
    const [selectedGame, setSelectedGame] = useState('truth_or_dare');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Game State
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinRotation, setSpinRotation] = useState(0);
    const [result, setResult] = useState<{ challenger: string, player: string } | null>(null);

    const [runArena, { loading }] = useMutation(ARENA_MUTATION);
    const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

    useEffect(() => {
        // Pre-select all members initially
        if (members) {
            setSelectedMembers(members.map(m => m.user.id));
        }
    }, [members]);

    const toggleMember = (userId: string) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    const handleStartGame = () => {
        if (selectedMembers.length < 2) return;
        setGameState('playing');
    };

    const handleSpin = async () => {
        if (selectedMembers.length < 2) return;

        setIsSpinning(true);
        setResult(null);

        // Visual Spin Animation
        const randomRot = 1440 + Math.random() * 720; // At least 4 spins
        setSpinRotation(prev => prev + randomRot);

        try {
            // Call Backend
            const { data } = await runArena({
                variables: {
                    group_id: groupId,
                    members: selectedMembers
                }
            });

            // Wait for animation to "finish" visually (approx 3s)
            setTimeout(async () => {
                setIsSpinning(false);
                if (data?.arena) {
                    setResult({
                        challenger: data.arena.challenger_id,
                        player: data.arena.player_id
                    });

                    // Announce to Group
                    const challengerName = members.find(m => m.user.id === data.arena.challenger_id)?.user.display_name || "Unknown";
                    const playerName = members.find(m => m.user.id === data.arena.player_id)?.user.display_name || "Unknown";

                    await sendMessage({
                        variables: {
                            group_id: groupId,
                            content: `🎲 **The Arena Decides!**\n\n**${challengerName}** sends a Truth or Dare to **${playerName}**! 🍾`
                        }
                    });
                }
            }, 3000);

        } catch (error) {
            console.error("Arena Error:", error);
            setIsSpinning(false);
        }
    };

    const getMemberName = (id: string) => members.find(m => m.user.id === id)?.user.display_name || "Unknown";

    return (
        <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-center gap-2 bg-slate-950">
                <Swords className="w-5 h-5 text-red-500" />
                <h2 className="font-bold text-lg tracking-wider">THE ARENA</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {gameState === 'setup' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Game</label>
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            >
                                <option value="truth_or_dare">🍾 Truth or Dare</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Gladiators ({selectedMembers.length})</label>
                            <div className="bg-slate-800/50 rounded-xl border border-slate-800 p-2 max-h-[300px] overflow-y-auto space-y-1">
                                {members.map((m) => (
                                    <div
                                        key={m.user.id}
                                        onClick={() => toggleMember(m.user.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                                            selectedMembers.includes(m.user.id)
                                                ? "bg-red-500/20 border border-red-500/50"
                                                : "hover:bg-slate-800 border border-transparent opacity-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                            selectedMembers.includes(m.user.id) ? "bg-red-500 border-red-500" : "border-slate-500"
                                        )}>
                                            {selectedMembers.includes(m.user.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                        <span className="text-sm font-medium">{m.user.display_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStartGame}
                            disabled={selectedMembers.length < 2}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            ENTER ARENA
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="h-full flex flex-col items-center justify-center relative">
                        {/* Round Table Visual */}
                        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                            {/* Contestants arranged in circle */}
                            {selectedMembers.map((memberId, i) => {
                                const angle = (i / selectedMembers.length) * 360; // Spread evenly
                                const radius = 140; // px
                                const x = radius * Math.cos((angle * Math.PI) / 180);
                                const y = radius * Math.sin((angle * Math.PI) / 180);

                                const isChallenger = result?.challenger === memberId;
                                const isPlayer = result?.player === memberId;
                                const isHighlighted = isChallenger || isPlayer;

                                return (
                                    <div
                                        key={memberId}
                                        className={cn(
                                            "absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 z-10",
                                            isChallenger ? "bg-amber-500 border-amber-300 scale-125 shadow-[0_0_20px_rgba(245,158,11,0.6)]" :
                                                isPlayer ? "bg-red-500 border-red-300 scale-125 shadow-[0_0_20px_rgba(239,68,68,0.6)]" :
                                                    "bg-slate-700 border-slate-600 text-slate-300"
                                        )}
                                        style={{
                                            transform: `translate(${x}px, ${y}px)`,
                                        }}
                                        title={getMemberName(memberId)}
                                    >
                                        {getMemberName(memberId).charAt(0).toUpperCase()}

                                        {/* Status Badge */}
                                        {isChallenger && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold">ASKER</div>
                                        )}
                                        {isPlayer && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">PLAYER</div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Bottle */}
                            <div
                                className="relative z-0 transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                                style={{ transform: `rotate(${spinRotation}deg)` }}
                            >
                                <div className="w-4 h-32 bg-gradient-to-t from-green-800/80 to-green-400/80 rounded-full border border-green-300/30 blur-[1px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center shadow-[0_0_15px_rgba(74,222,128,0.4)]"></div>
                                {/* Bottle Cap indicator */}
                                <div className="w-6 h-10 bg-slate-300 absolute -top-16 left-1/2 -translate-x-1/2 rounded-t-lg shadow-sm"></div>
                            </div>

                        </div>

                        {/* Controls */}
                        <div className="mt-12 z-20">
                            <button
                                onClick={handleSpin}
                                disabled={isSpinning}
                                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-xl shadow-red-900/50 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSpinning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        SPINNING...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 fill-white" />
                                        SPIN THE BOTTLE
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Result Text Display */}
                        {result && !isSpinning && (
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl text-center animate-in slide-in-from-bottom-5">
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">THE ARENA HAS SPOKEN</p>
                                <p className="text-lg">
                                    <span className="font-bold text-amber-400">{getMemberName(result.challenger)}</span>
                                    <span className="mx-2 text-slate-500">asks</span>
                                    <span className="font-bold text-red-400">{getMemberName(result.player)}</span>
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setGameState('setup')}
                            className="absolute top-0 right-0 p-2 text-slate-600 hover:text-white"
                            title="Reset Game"
                        >
                            Config
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
