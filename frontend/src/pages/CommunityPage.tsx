import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { EXPLORE_GROUPS_QUERY, ADD_MEMBER_TO_GROUP_MUTATION } from "@/queries/chat";
import { Search, Globe, TrendingUp, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GroupCard } from "@/components/community/GroupCard";
import type { Group } from "@/types/chat";

export function CommunityPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch groups
    const { data, loading, refetch } = useQuery(EXPLORE_GROUPS_QUERY, {
        variables: {
            search: searchTerm ? `%${searchTerm}%` : "%%",
            limit: 20,
            user_id: user?.id
        },
        skip: !user,
        fetchPolicy: "network-only"
    });

    const [joinGroup] = useMutation(ADD_MEMBER_TO_GROUP_MUTATION);

    const handleJoin = async (groupId: string) => {
        if (!user) return;
        try {
            await joinGroup({
                variables: {
                    group_id: groupId,
                    user_id: user.id
                }
            });
            refetch(); // Refresh to update "am_i_member" status
            // Optional: Show toast
        } catch (error) {
            console.error("Failed to join group:", error);
            // Likely already member or error
        }
    };

    const groups: Group[] = data?.groups || [];

    // Simple randomization for now to simulate "sections" if we don't have distinct data
    // In a real app, we'd have specific queries for "Popular" vs "Recommended"
    const popularGroups = [...groups].sort((a, b) =>
        (b.members_aggregate?.aggregate?.count || 0) - (a.members_aggregate?.aggregate?.count || 0)
    ).slice(0, 3);

    const recommendedGroups = groups.slice(3, 9);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
            {/* Happy Header */}
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 py-12 px-8 text-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 relative z-10 font-display">
                    Find Your Tribe ✨
                </h1>
                <p className="text-violet-100 text-lg max-w-2xl mx-auto relative z-10 mb-8">
                    Discover amazing communities, meet new people, and share your passions.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative z-10">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full shadow-lg border-0 focus:ring-4 focus:ring-violet-300 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-900 transition-shadow"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-12">
                {/* Most Popular Section */}
                {popularGroups.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-fuchsia-500" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    onJoin={() => handleJoin(group.id)}
                                    isJoined={!!(group.am_i_member && group.am_i_member.length > 0)}
                                    onView={() => navigate(`/chat/${group.id}`)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommended Section */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading amazing communities...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedGroups.length > 0 ? recommendedGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    onJoin={() => handleJoin(group.id)}
                                    isJoined={!!(group.am_i_member && group.am_i_member.length > 0)}
                                    onView={() => navigate(`/chat/${group.id}`)}
                                />
                            )) : (
                                <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">No communities found matching "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
