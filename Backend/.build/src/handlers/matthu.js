"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const gemini_1 = require("../utils/gemini");
const message_1 = require("../models/message");
const handler = async (event) => {
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
            const recentMessages = await message_1.Message.fetchRecent(group_id, 10);
            if (recentMessages.length > 0) {
                const context = recentMessages.map(msg => `${msg.sender.display_name}: ${msg.content}`).join('\n');
                fullPrompt = `Context from recent chat history:\n${context}\n\nUser Question: ${prompt}`;
            }
        }
        const answer = await (0, gemini_1.generateResponse)(fullPrompt);
        return {
            statusCode: 200,
            body: JSON.stringify({ answer }),
        };
    }
    catch (error) {
        console.error('Error handling matthu query:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=matthu.js.map