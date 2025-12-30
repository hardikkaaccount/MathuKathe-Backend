import { generateContent } from '../utils/gemini';
import { Message } from './message';

export class TwinModel {
    /**
     * Generates a reply as an AI twin based on the recent conversation context.
     * @param messages - Recent messages to provide context.
     */
    static async generateReply(messages: any[]): Promise<string> {
        if (messages.length === 0) {
            return "I don't have enough context to reply yet.";
        }

        const context = messages.map(msg =>
            `${msg.sender.display_name}: ${msg.content}`
        ).join('\n');

        const prompt = `You are an AI assistant in a group chat. 
        Here is the recent conversation history:
        ${context}
        
        Draft a relevant, helpful, and natural reply to the last message as if you were a participant in the chat. 
        Keep it concise. Do not explicitly say you are an AI unless asked.`;

        return await generateContent(prompt);
    }
}
