import { z } from 'zod';
import { ArenaModel } from '../models/arena';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const arenaSchema = z.object({
    members: z.array(z.string()).min(2, "Arena requires at least 2 members."),
});

export const handler = apiHandler({ schema: arenaSchema }, async (event, context, { body }) => {
    const { members } = body;

    // Business Logic via Model
    const contestants = ArenaModel.selectContestants(members);

    return {
        statusCode: 200,
        body: JSON.stringify(contestants),
    };
});
