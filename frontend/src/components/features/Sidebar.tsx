import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Plus, Loader2, LogOut } from "lucide-react";
import { useQuery } from "@apollo/client";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";
import { GET_USER_GROUPS_QUERY } from "@/queries/chat";
import { CreateGroupModal } from "../modals/CreateGroupModal";

export function Sidebar() {
    const { user, logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const location = useLocation();

    const { data, loading, refetch } = useQuery(GET_USER_GROUPS_QUERY, {
        variables: { user_id: user?.id },
        skip: !user
    });

    const groups = data?.group_members.map((gm: any) => gm.group) || [];

    return (
        <>
            <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
                <div className="p-4 h-14 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">MathuKathe</span>
                    <Link to="/profile" className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors" title="My Profile">
                        <Settings className="w-5 h-5 text-slate-500" />
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            <span>Groups</span>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {groups.map((group: any) => (
                                    <Link
                                        key={group.id}
                                        to={`/chat/${group.id}`}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium",
                                            location.pathname === `/chat/${group.id}`
                                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <span className="truncate">{group.name}</span>
                                    </Link>
                                ))}
                                {groups.length === 0 && (
                                    <div className="text-xs text-slate-400 italic px-2 py-1">
                                        No groups joined yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-xs">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium dark:text-white truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-slate-500 truncate">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {user && (
                <CreateGroupModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onGroupCreated={() => {
                        refetch();
                    }}
                    userId={user.id}
                />
            )}
        </>
    );
}
