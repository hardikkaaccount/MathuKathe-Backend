"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const message_1 = require("../models/message");
const gemini_1 = require("../utils/gemini");
const handler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { group_id, from_date, to_date } = input?.input || {};
        if (!group_id || !from_date || !to_date) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: group_id, from_date, to_date' }),
            };
        }
        const messages = await message_1.Message.fetchByGroupAndDateRange(group_id, from_date, to_date);
        if (messages.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ summary: 'No messages found in the specified period.' }),
            };
        }
        // Format messages for the AI
        const formattedChat = messages.map(msg => `${msg.created_at} - ${msg.sender.display_name}: ${msg.content}`).join('\n');
        const summary = await (0, gemini_1.generateSummary)(formattedChat);
        return {
            statusCode: 200,
            body: JSON.stringify({ summary }),
        };
    }
    catch (error) {
        console.error('Error generating summary:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=summary.js.map