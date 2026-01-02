import { useState } from "react";
import { Loader2, X, UserPlus } from "lucide-react";
import { useMutation } from "@apollo/client";
import { ADD_MEMBER_TO_GROUP_MUTATION } from "@/queries/chat";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export function AddMemberModal({ isOpen, onClose, groupId }: AddMemberModalProps) {
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [addMember] = useMutation(ADD_MEMBER_TO_GROUP_MUTATION);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await addMember({
                variables: {
                    group_id: groupId,
                    user_id: userId
                }
            });
            setStatus({ type: 'success', message: 'Member added successfully!' });
            setUserId("");
            setTimeout(onClose, 1500);
        } catch (error: any) {
            console.error("Failed to add member:", error);
            setStatus({
                type: 'error',
                message: error.message || 'Failed to add member. Check ID.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Add Member
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {status && (
                        <div className={cn(
                            "p-3 rounded-md text-sm",
                            status.type === 'success' ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                        )}>
                            {status.message}
                        </div>
                    )}

                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            User ID (UUID)
                        </label>
                        <input
                            id="userId"
                            type="text"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-slate-800 dark:text-white font-mono text-sm"
                            placeholder="e.g. 123e4567-e89b-..."
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Ask the user for their ID from their Profile page.
                        </p>
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
                            disabled={loading || !userId.trim()}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Quick utility for classnames since we're in a separate file and it's small
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
