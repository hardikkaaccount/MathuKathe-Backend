import { z } from 'zod';
import { Message } from '../models/message';
import { TwinModel } from '../models/twin';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const twinSchema = z.object({
    group_id: z.string().uuid(),
});

export const handler = apiHandler({ schema: twinSchema }, async (event, context, { body }) => {
    const { group_id } = body;

    console.log(`Generating twin reply for group ${group_id}`);

    // Data Fetching
    // Fetch last 10 messages for context
    const recentMessages = await Message.fetchRecent(group_id, 10);

    // Business Logic
    const reply = await TwinModel.generateReply(recentMessages);

    return {
        statusCode: 200,
        body: JSON.stringify({ reply }),
    };
});
