export interface User {
    id: string;
    display_name: string;
    email?: string;
    avatar_url?: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    creator?: User;
    members?: GroupMember[];
    members_aggregate?: {
        aggregate: {
            count: number;
        };
    };
    am_i_member?: { user_id: string }[];
}

export interface GroupMember {
    user: User;
    role: string;
    joined_at: string;
}

export interface Message {
    id: string;
    content: string;
    sender: User;
    created_at: string;
    group_id: string;
}

