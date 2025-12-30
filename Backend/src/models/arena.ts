import { ArenaResponse } from '../types/arena';

export class ArenaModel {
    /**
     * Randomly selects 2 distinct members from the list to be contestants.
     * @param members - Array of member IDs.
     * @returns Object containing challenger_id and player_id.
     * @throws Error if fewer than 2 members are provided.
     */
    static selectContestants(members: string[]): ArenaResponse {
        if (!members || members.length < 2) {
            throw new Error('Arena requires at least 2 members.');
        }

        // Randomly select 2 distinct members
        const shuffled = [...members].sort(() => 0.5 - Math.random());

        return {
            challenger_id: shuffled[0],
            player_id: shuffled[1]
        };
    }
}
