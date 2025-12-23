import { APIGatewayProxyHandler } from 'aws-lambda';
import { generateResponse } from '../utils/gemini';
import { Message } from '../models/message';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { prompt, group_id } = input?.input || {};

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required field: prompt' }),
            };
        }

        let fullPrompt = prompt;

        if (group_id) {
            console.log(`Fetching context for group ${group_id}`);
            const recentMessages = await Message.fetchRecent(group_id, 10);

            if (recentMessages.length > 0) {
                const context = recentMessages.map(msg =>
                    `${msg.sender.display_name}: ${msg.content}`
                ).join('\n');

                fullPrompt = `Context from recent chat history:\n${context}\n\nUser Question: ${prompt}`;
            }
        }

        const answer = await generateResponse(fullPrompt);

        return {
            statusCode: 200,
            body: JSON.stringify({ answer }),
        };

    } catch (error: any) {
        console.error('Error handling matthu query:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
