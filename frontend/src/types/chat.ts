export interface Group {
    id: string;
    name: string;
}

export interface Message {
    id: string;
    content: string;
    created_at: string;
    sender: {
        display_name: string;
    };
}

