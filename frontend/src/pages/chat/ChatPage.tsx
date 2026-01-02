import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, Loader2, MoreVertical, UserPlus, Sparkles, Wand2, Swords } from "lucide-react";
import { useSubscription, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { GET_MESSAGES_SUBSCRIPTION, SEND_MESSAGE_MUTATION, GET_GROUP_DETAILS_QUERY, ADD_MEMBER_TO_GROUP_MUTATION, MATTHU_QUERY, AI_TWIN_REPLY_MUTATION } from "@/queries/chat";
import { GroupDetailsModal } from "@/components/modals/GroupDetailsModal";
import { SummaryModal } from "@/components/modals/SummaryModal";
import { Arena } from "@/components/Arena";

export function ChatPage() {
    const { id: groupId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isArenaOpen, setIsArenaOpen] = useState(false);
    const [detailsModalView, setDetailsModalView] = useState<'details' | 'add_members'>('details');
    // Track local join state to immediately update UI
    const [hasJoined, setHasJoined] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Group Details Query
    const { data: groupData, loading: groupLoading, refetch: refetchGroup } = useQuery(GET_GROUP_DETAILS_QUERY, {
        variables: { group_id: groupId },
        skip: !groupId
    });

    const group = groupData?.groups_by_pk;

    // Check if current user is a member
    const isMember = hasJoined || group?.members.some((m: any) => m.user.id === user?.id);

    // Subscription Hook
    const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, {
        variables: { group_id: groupId },
        skip: !groupId,
    });

    const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE_MUTATION);
    const [joinGroup, { loading: joining }] = useMutation(ADD_MEMBER_TO_GROUP_MUTATION);
    const [askMathu] = useMutation(MATTHU_QUERY);
    const [generateTwinReply, { loading: generatingTwin }] = useMutation(AI_TWIN_REPLY_MUTATION);

    const messages = data?.messages ? [...data.messages].reverse() : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTwinGen = async () => {
        if (!groupId) return;
        try {
            const { data } = await generateTwinReply({ variables: { group_id: groupId } });
            if (data?.ai_twin_reply?.reply) {
                setInputValue(data.ai_twin_reply.reply);
            }
        } catch (error) {
            console.error("Failed to generate twin reply:", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !groupId) return;

        const content = inputValue;
        setInputValue("");

        try {
            await sendMessage({ variables: { group_id: groupId, content } });

            // Check for Mathu invocation
            if (content.toLowerCase().includes("@mathu")) {
                // Fire and forget - let backend handle the reply insertion
                askMathu({
                    variables: {
                        prompt: content, // Send full content or strip it? "prompt" in backend handles limits.
                        group_id: groupId
                    }
                }).catch(err => console.error("Mathu failed to reply:", err));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleJoinGroup = async () => {
        if (!user || !groupId) return;
        try {
            await joinGroup({
                variables: {
                    group_id: groupId,
                    user_id: user.id
                }
            });
            setHasJoined(true);
            refetchGroup();
        } catch (error) {
            console.error("Failed to join group:", error);
        }
    };

    const openDetails = () => {
        setDetailsModalView('details');
        setIsDetailsModalOpen(true);
    };

    const openAddMember = () => {
        setDetailsModalView('add_members');
        setIsDetailsModalOpen(true);
    };

    if (!groupId) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900/50">
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquareIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Select a group</h3>
                    <p className="text-slate-500 dark:text-slate-400">Choose a conversation from the sidebar to start chatting.</p>
                </div>
            </div>
        )
    }

    if (error) {
        console.error("Subscription error:", error);
    }

    return (
        <div className="flex flex-col md:flex-row bg-white dark:bg-slate-950 h-[100dvh] overflow-hidden">
            {/* Main Chat Column */}
            <div className={cn(
                "flex flex-col transition-all duration-300 bg-slate-50 dark:bg-slate-950 order-2 md:order-1",
                isArenaOpen
                    ? "h-1/2 w-full md:h-full md:w-1/2 border-t border-slate-200 dark:border-slate-800 md:border-t-0 md:border-r"
                    : "h-full w-full"
            )}>
                {/* Header */}
                <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-950 shrink-0">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={openDetails}>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">#</span>
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{group?.name || "Loading..."}</h2>
                            <p className="text-xs text-slate-500">{messages.length} messages • View Info</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Arena Button */}
                        <button
                            onClick={() => setIsArenaOpen(!isArenaOpen)}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                isArenaOpen
                                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                                    : "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                            )}
                            title="Enter The Arena"
                        >
                            <Swords className="w-5 h-5" />
                        </button>

                        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

                        {/* Summary Button */}
                        <button
                            onClick={() => setIsSummaryModalOpen(true)}
                            className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full text-amber-500 hover:text-amber-600 transition-colors"
                            title="Generate Summary"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>

                        {/* Only show Add Member if user is a member */}
                        {isMember && (
                            <button
                                onClick={openAddMember}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                                title="Add Member"
                            >
                                <UserPlus className="w-5 h-5" />
                            </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                    {loading && messages.length === 0 ? (
                        <div className="flex justify-center pt-8">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender?.display_name === user?.name;
                            const isMathu = msg.sender?.display_name === "Mathu AI";

                            return (
                                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm relative overflow-hidden",
                                        isMe
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : isMathu
                                                ? "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.7)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                                    )}>
                                        {isMathu && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                        )}
                                        {!isMe && (
                                            <p className={cn("text-xs font-medium mb-1", isMathu ? "text-fuchsia-600 dark:text-fuchsia-400" : "text-indigo-600 dark:text-indigo-400")}>
                                                {msg.sender?.display_name || 'Unknown'}
                                            </p>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap relative z-10">{msg.content}</p>
                                        <p className={cn("text-[10px] mt-1 text-right opacity-70 relative z-10", isMe ? "text-indigo-100" : "text-slate-400")}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
                    {isMember ? (
                        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                            {/* Twin Button */}
                            <button
                                type="button"
                                onClick={handleTwinGen}
                                disabled={generatingTwin}
                                className="p-2 mr-1 text-fuchsia-500 hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 rounded-full transition-colors"
                                title="Generate AI Reply"
                            >
                                {generatingTwin ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                            </button>

                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-100 dark:bg-slate-900 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || sending}
                                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleJoinGroup}
                                disabled={joining}
                                className="w-full max-w-sm flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 font-medium disabled:opacity-70"
                            >
                                {joining ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Join this group to chat
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Arena Column */}
            {isArenaOpen && (
                <div className="w-full h-1/2 md:w-1/2 md:h-full order-1 md:order-2 animate-in slide-in-from-top-10 md:slide-in-from-right-10 duration-300 shadow-2xl z-10 transition-all">
                    <Arena
                        groupId={groupId || ""}
                        members={group?.members || []}
                        currentUser={user}
                    />
                </div>
            )}

            <GroupDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                group={group}
                loading={groupLoading}
                initialView={detailsModalView}
            />

            <SummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                groupId={groupId || ""}
            />
        </div>
    );
}

function MessageSquareIcon() {
    return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    )
}
