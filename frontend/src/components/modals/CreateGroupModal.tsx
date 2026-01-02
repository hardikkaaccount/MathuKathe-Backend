import { useState } from "react";
import { Loader2, X, Users } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_GROUP_MUTATION, UPDATE_GROUP_DESCRIPTION_MUTATION } from "@/queries/chat";
import { UserSearch } from "../UserSearch";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGroupCreated: () => void;
    userId: string;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated, userId }: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createGroup] = useMutation(CREATE_GROUP_MUTATION);
    const [updateDescription] = useMutation(UPDATE_GROUP_DESCRIPTION_MUTATION);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Step 1: Create Group with Members
            console.log("Creating group...", { name, members: selectedMembers.map(m => m.id) });
            const memberIds = selectedMembers.map(m => m.id);
            // Ensure we don't add ourselves if we are already selected (though logic should prevent it), 
            // but usually creator is added by backend.

            const { data } = await createGroup({
                variables: {
                    name,
                    members: memberIds
                }
            });

            if (!data?.create_group?.group_id) {
                throw new Error("Failed to get group ID from server");
            }

            const groupId = data.create_group.group_id;
            console.log("Group created:", groupId);

            // Step 2: Update Description (if provided)
            if (description.trim()) {
                console.log("Updating description...");
                try {
                    await updateDescription({
                        variables: {
                            group_id: groupId,
                            description
                        }
                    });
                } catch (descError) {
                    console.error("Failed to update description, but group was created:", descError);
                }
            }

            onGroupCreated();
            onClose();
            setName("");
            setDescription("");
            setSelectedMembers([]);
        } catch (err: any) {
            console.error("Failed to create group:", err);
            setError(err.message || "Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Create New Group</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Group Details Section */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="groupName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Group Name
                            </label>
                            <input
                                id="groupName"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white"
                                placeholder="e.g. Project Team"
                            />
                        </div>

                        <div>
                            <label htmlFor="groupDesc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Description <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                id="groupDesc"
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white resize-none"
                                placeholder="What's this group about?"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-medium text-slate-900 dark:text-white">Add Members</h4>
                            <span className="text-xs text-slate-500 ml-auto">{selectedMembers.length} selected</span>
                        </div>

                        <UserSearch
                            selectedUsers={selectedMembers}
                            onSelect={setSelectedMembers}
                            excludeUserIds={[userId]}
                        />
                    </div>
                </form>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Create Group (${selectedMembers.length + 1})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
