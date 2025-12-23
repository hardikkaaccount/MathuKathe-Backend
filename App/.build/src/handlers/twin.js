"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const gemini_1 = require("../utils/gemini");
const message_1 = require("../models/message");
const handler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { group_id } = input?.input || {};
        if (!group_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required field: group_id' }),
            };
        }
        console.log(`Generating twin reply for group ${group_id}`);
        // Fetch last 10 messages for context
        const recentMessages = await message_1.Message.fetchRecent(group_id, 10);
        let context = "";
        if (recentMessages.length > 0) {
            context = recentMessages.map(msg => `${msg.sender.display_name}: ${msg.content}`).join('\n');
        }
        else {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "I don't have enough context to reply yet." }),
            };
        }
        const prompt = `You are an AI assistant in a group chat. 
        Here is the recent conversation history:
        ${context}
        
        Draft a relevant, helpful, and natural reply to the last message as if you were a participant in the chat. 
        Keep it concise. Do not explicitly say you are an AI unless asked.`;
        const reply = await (0, gemini_1.generateResponse)(prompt);
        return {
            statusCode: 200,
            body: JSON.stringify({ reply }),
        };
    }
    catch (error) {
        console.error('Error handling ai_twin_reply:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=twin.js.map