export interface ArenaInput {
    members: string[]; // Array of member IDs
}

export interface ArenaResponse {
    challenger_id: string;
    player_id: string;
}
