import { useState, useEffect } from "react";
import { X, Calendar, User, Users, Loader2, UserPlus, ArrowLeft } from "lucide-react";
import { useMutation } from "@apollo/client";
import { ADD_MEMBERS_ACTION_MUTATION, GET_GROUP_DETAILS_QUERY } from "@/queries/chat";
import { UserSearch } from "../UserSearch";

interface GroupDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: any;
    loading?: boolean;
    initialView?: 'details' | 'add_members';
}

export function GroupDetailsModal({ isOpen, onClose, group, loading, initialView = 'details' }: GroupDetailsModalProps) {
    const [view, setView] = useState<'details' | 'add_members'>(initialView);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [adding, setAdding] = useState(false);

    // Reset view when opening/closing or changing initialView
    useEffect(() => {
        if (isOpen) {
            setView(initialView);
        }
    }, [isOpen, initialView]);


    const [addMembers] = useMutation(ADD_MEMBERS_ACTION_MUTATION, {
        refetchQueries: [
            { query: GET_GROUP_DETAILS_QUERY, variables: { group_id: group?.id } }
        ]
    });

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

    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) return;
        setAdding(true);
        try {
            await addMembers({
                variables: {
                    group_id: group.id,
                    members: selectedMembers.map(m => m.id)
                }
            });
            setView('details');
            setSelectedMembers([]);
        } catch (error) {
            console.error("Failed to add members:", error);
            alert("Failed to add members. Please try again.");
        } finally {
            setAdding(false);
        }
    };

    const handleClose = () => {
        setView('details');
        setSelectedMembers([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        {view === 'add_members' && (
                            <button
                                onClick={() => setView('details')}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full mr-1"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </button>
                        )}
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                            {view === 'details' ? 'Group Details' : 'Add Members'}
                        </h3>
                    </div>
                    <button onClick={handleClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {view === 'details' ? (
                        <div className="space-y-6">
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
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-500" />
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Members ({group.members?.length || 0})
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() => setView('add_members')}
                                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <UserPlus className="w-3 h-3" />
                                        Add Member
                                    </button>
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
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Search for users to add to <strong>{group.name}</strong>.
                            </p>
                            <UserSearch
                                selectedUsers={selectedMembers}
                                onSelect={setSelectedMembers}
                                excludeUserIds={group.members?.map((m: any) => m.user?.id) || []}
                            />
                        </div>
                    )}
                </div>

                {/* Footer for Add Members view */}
                {view === 'add_members' && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setView('details')}
                            className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddMembers}
                            disabled={adding || selectedMembers.length === 0}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : `Add ${selectedMembers.length > 0 ? selectedMembers.length : ''} Members`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
