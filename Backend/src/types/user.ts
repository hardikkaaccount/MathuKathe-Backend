export interface UserData {
    id: string;
    email?: string;
    display_name?: string;
    password_hash: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    display_name: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterResponse {
    user_id: string;
}

// Hasura Response Types
export interface InsertUserResponse {
    insert_users_one: UserData;
}

export interface GetUsersResponse {
    users: UserData[];
}
