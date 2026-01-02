import { Users, Check, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Group } from "@/types/chat";

interface GroupCardProps {
    group: Group;
    onJoin: () => void;
    isJoined: boolean;
    onView: () => void;
}

export function GroupCard({ group, onJoin, isJoined, onView }: GroupCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 p-6 transition-all hover:scale-[1.02] flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {group.name[0]?.toUpperCase() || '#'}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    <span>{group.members_aggregate?.aggregate?.count || 0}</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {group.name}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                {group.description || "A friendly community waiting for you to join!"}
            </p>

            <div className="flex items-center gap-3 mt-auto">
                <button
                    onClick={onView}
                    className="flex-1 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    View
                </button>
                <button
                    onClick={isJoined ? onView : onJoin}
                    className={cn(
                        "flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all",
                        isJoined
                            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50 cursor-default"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95"
                    )}
                >
                    {isJoined ? (
                        <>
                            <Check className="w-4 h-4" />
                            Joined
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Join
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
