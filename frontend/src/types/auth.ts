export interface LoginResponse {
    login_user: {
        token: string;
    };
}

export interface RegisterResponse {
    register_user: {
        user_id: string;
    };
}

export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
}

export interface LoadAppDataResponse {
    load_app_data: {
        user_profile: UserProfile;
        groups: GroupSummary[];
    };
}

export interface GroupSummary {
    id: string;
    name: string;
    unread_count: number;
}
