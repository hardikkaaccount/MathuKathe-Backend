import { z } from 'zod';
import { Message } from '../models/message';
import { MatthuModel } from '../models/matthu';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const matthuSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    group_id: z.string().uuid().optional(),
});

export const handler = apiHandler({ schema: matthuSchema }, async (event, context, { body }) => {
    const { prompt, group_id } = body;

    // Data Fetching (if needed)
    let recentMessages: any[] = [];
    if (group_id) {
        console.log(`Fetching context for group ${group_id}`);
        recentMessages = await Message.fetchRecent(group_id, 10);
    }

    // Business Logic
    const answer = await MatthuModel.answerQuestion(prompt, recentMessages);

    return {
        statusCode: 200,
        body: JSON.stringify({ answer }),
    };
});
