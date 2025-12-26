import { z } from 'zod';
import { Message } from '../models/message';
import { SummaryModel } from '../models/summary';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const summarySchema = z.object({
    group_id: z.string().uuid(),
    from_date: z.string().datetime(),
    to_date: z.string().datetime(),
});

export const handler = apiHandler({ schema: summarySchema }, async (event, context, { body }) => {
    const { group_id, from_date, to_date } = body;

    // Data Fetching via Model
    const messages = await Message.fetchByGroupAndDateRange(group_id, from_date, to_date);

    if (messages.length === 0) {
        return {
            statusCode: 200,
            body: JSON.stringify({ summary: 'No messages found in the specified period.' }),
        };
    }

    const formattedChat = messages.map(msg =>
        `${msg.created_at} - ${msg.sender.display_name}: ${msg.content}`
    ).join('\n');

    // Call Summary Logic
    const summary = await SummaryModel.generate(formattedChat);

    return {
        statusCode: 200,
        body: JSON.stringify({ summary }),
    };
});
