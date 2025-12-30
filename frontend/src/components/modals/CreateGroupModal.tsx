import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_GROUP_MUTATION, UPDATE_GROUP_DESCRIPTION_MUTATION } from "@/queries/chat";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGroupCreated: () => void;
    userId: string;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
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
            // Step 1: Create Group
            console.log("Creating group...", { name });
            const { data } = await createGroup({ variables: { name } });

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
                    // We continue anyway since group is created
                }
            }

            onGroupCreated();
            onClose();
            setName("");
            setDescription("");
        } catch (err: any) {
            console.error("Failed to create group:", err);
            setError(err.message || "Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Create New Group</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}
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
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white resize-none"
                            placeholder="What's this group about?"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-3 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
