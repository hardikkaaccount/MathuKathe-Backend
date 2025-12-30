import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, Loader2, MoreVertical, UserPlus } from "lucide-react";
import { useSubscription, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { AddMemberModal } from "@/components/modals/AddMemberModal";
// Message type unused for now as we map directly, or can cast
// import type { Message } from "@/types/chat"; 

// Subscription Query
import { GET_MESSAGES_SUBSCRIPTION, SEND_MESSAGE_MUTATION, GET_GROUP_DETAILS_QUERY } from "@/queries/chat";
import { GroupDetailsModal } from "@/components/modals/GroupDetailsModal";
export function ChatPage() {
    const { id: groupId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Group Details Query
    const { data: groupData, loading: groupLoading, error: groupError } = useQuery(GET_GROUP_DETAILS_QUERY, {
        variables: { group_id: groupId },
        skip: !groupId
    });

    useEffect(() => {
        console.log("Group Data:", groupData);
        console.log("Group Loading:", groupLoading);
        console.log("Group Error:", groupError);
    }, [groupData, groupLoading, groupError]);

    const group = groupData?.groups_by_pk;


    // Subscription Hook
    const { data, loading, error } = useSubscription(GET_MESSAGES_SUBSCRIPTION, {
        variables: { group_id: groupId },
        skip: !groupId,
    });

    const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE_MUTATION);

    const messages = data?.messages ? [...data.messages].reverse() : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !groupId) return;

        const content = inputValue;
        setInputValue("");

        try {
            await sendMessage({ variables: { group_id: groupId, content } });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (!groupId) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900/50">
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquareIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Select a group</h3>
                    <p className="text-slate-500 dark:text-slate-400">Choose a conversation from the sidebar to start chatting.</p>
                </div>
            </div>
        )
    }

    if (error) {
        console.error("Subscription error:", error);
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsDetailsModalOpen(true)}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">#</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">{group?.name || "Loading..."}</h2>
                        <p className="text-xs text-slate-500">{messages.length} messages • View Info</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                        title="Add Member"
                    >
                        <UserPlus className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center pt-8">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender?.display_name === user?.name;
                        return (
                            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                    isMe
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                                )}>
                                    {!isMe && (
                                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                                            {msg.sender?.display_name || 'Unknown'}
                                        </p>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <p className={cn("text-[10px] mt-1 text-right opacity-70", isMe ? "text-indigo-100" : "text-slate-400")}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 dark:bg-slate-900 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || sending}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                groupId={groupId}
            />

            <GroupDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                group={group}
                loading={groupLoading}
            />
        </div>
    );
}

function MessageSquareIcon() {
    return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    )
}
