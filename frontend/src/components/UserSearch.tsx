
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Search, Check, X, Loader2 } from "lucide-react";
import type { User } from "@/types/chat";
import { SEARCH_USERS_QUERY } from "@/queries/user";

interface UserSearchProps {
    onSelect: (users: User[]) => void;
    selectedUsers: User[];
    excludeUserIds?: string[];
}

export function UserSearch({ onSelect, selectedUsers, excludeUserIds = [] }: UserSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [results, setResults] = useState<User[]>([]);

    const [searchUsers, { loading, data }] = useLazyQuery(SEARCH_USERS_QUERY);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Perform search
    useEffect(() => {
        if (debouncedSearch.trim().length >= 2) {
            searchUsers({
                variables: { search: `%${debouncedSearch}%` }
            });
        } else {
            setResults([]);
        }
    }, [debouncedSearch, searchUsers]);

    // Update results when data changes
    useEffect(() => {
        if (data?.users) {
            const filtered = data.users.filter((u: User) => !excludeUserIds.includes(u.id));
            setResults(filtered);
        }
    }, [data, excludeUserIds]);

    const handleToggleUser = (user: User) => {
        const isSelected = selectedUsers.some(u => u.id === user.id);
        if (isSelected) {
            onSelect(selectedUsers.filter(u => u.id !== user.id));
        } else {
            onSelect([...selectedUsers, user]);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
                {loading && (
                    <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    </div>
                )}
            </div>

            {/* Search Results */}
            {results.length > 0 && searchTerm.length >= 2 && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 max-h-48 overflow-y-auto shadow-sm">
                    {results.map((user) => {
                        const isSelected = selectedUsers.some(u => u.id === user.id);
                        return (
                            <div
                                key={user.id}
                                onClick={() => handleToggleUser(user)}
                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-900/20"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${isSelected
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                        }`}>
                                        {user.display_name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {user.display_name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {user.email || "No email"}
                                        </p>
                                    </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selected Users Pills */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {selectedUsers.map((user) => (
                        <span
                            key={user.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
                        >
                            {user.display_name}
                            <button
                                type="button"
                                onClick={() => handleToggleUser(user)}
                                className="hover:text-indigo-600 dark:hover:text-indigo-200"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
