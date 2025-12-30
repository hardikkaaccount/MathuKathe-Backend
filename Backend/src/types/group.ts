export interface CreateGroupInput {
    name: string;
    members?: string[];
}

export interface AddMembersInput {
    group_id: string;
    members: string[];
}

// Hasura Response Types
export interface CreateGroupResponse {
    insert_groups_one: {
        id: string;
    };
}

export interface AddMembersResponse {
    insert_group_members: {
        affected_rows: number;
    };
}

export interface GetUserGroupsResponse {
    group_members: {
        group: {
            id: string;
            name: string;
        }
    }[];
}

// App Load Response Types
export interface GroupSummary {
    id: string;
    name: string;
    unread_count: number;
}

export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
}

export interface AppLoadResponse {
    user_profile: UserProfile;
    groups: GroupSummary[];
}
