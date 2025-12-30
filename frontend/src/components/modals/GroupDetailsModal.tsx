import { X, Calendar, User, Users, Loader2 } from "lucide-react";

interface GroupDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: any;
    loading?: boolean;
}

export function GroupDetailsModal({ isOpen, onClose, group, loading }: GroupDetailsModalProps) {
    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-8 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    if (!group) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Group Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{group.name}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {group.description || "No description provided."}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>Created on {new Date(group.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <User className="w-4 h-4" />
                            <span>Created by {group.creator?.display_name || "Unknown"}</span>
                        </div>
                    </div>

                    {/* Members List */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-slate-500" />
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Members ({group.members?.length || 0})
                            </h4>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                            {group.members?.map((m: any) => (
                                <div key={m.user?.id || Math.random()} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                        {m.user?.display_name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {m.user?.display_name || "Unknown User"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
