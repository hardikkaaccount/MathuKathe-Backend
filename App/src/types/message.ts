export interface MessageData {
    id: string;
    content: string;
    created_at: string;
    sender: {
        display_name: string;
    };
}

export interface GetMessagesResponse {
    messages: MessageData[];
}
