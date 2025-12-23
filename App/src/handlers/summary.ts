import { APIGatewayProxyHandler } from 'aws-lambda';
import { Message } from '../models/message';
import { generateSummary } from '../utils/gemini';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { group_id, from_date, to_date } = input?.input || {};

        if (!group_id || !from_date || !to_date) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: group_id, from_date, to_date' }),
            };
        }

        const messages = await Message.fetchByGroupAndDateRange(group_id, from_date, to_date);

        if (messages.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ summary: 'No messages found in the specified period.' }),
            };
        }

        // Format messages for the AI
        const formattedChat = messages.map(msg =>
            `${msg.created_at} - ${msg.sender.display_name}: ${msg.content}`
        ).join('\n');

        const summary = await generateSummary(formattedChat);

        return {
            statusCode: 200,
            body: JSON.stringify({ summary }),
        };

    } catch (error: any) {
        console.error('Error generating summary:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
