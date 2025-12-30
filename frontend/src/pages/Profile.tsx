import { useQuery } from "@apollo/client";
import { Mail, Hash, Loader2 } from "lucide-react";
import { LOAD_APP_DATA_QUERY } from "@/queries/chat";
import { useAuth } from "@/hooks/useAuth";
import type { LoadAppDataResponse } from "@/types/auth";

export function Profile() {
    const { user, logout } = useAuth();

    const { data, loading } = useQuery<LoadAppDataResponse>(LOAD_APP_DATA_QUERY, {
        skip: !user
    });

    const profile = data?.load_app_data.user_profile;

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

            <div className="bg-white dark:bg-slate-800 shadow rounded-lg max-w-2xl w-full">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
                            {profile?.display_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {profile?.display_name || "User"}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Member
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Email Address
                        </label>
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{profile?.email}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                            User ID
                        </label>
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-mono text-sm">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <span>{profile?.id}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
