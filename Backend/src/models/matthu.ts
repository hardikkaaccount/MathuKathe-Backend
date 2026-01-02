import { generateContent } from '../utils/gemini';
import { Message } from './message';

export class MatthuModel {
    /**
     * Answers a user question, optionally using context from recent messages.
     * @param prompt - The user's question.
     * @param contextMessages - (Optional) Array of recent message objects.
     */
    static async answerQuestion(prompt: string, contextMessages: any[] = []): Promise<string> {
        let fullPrompt = prompt;

        if (contextMessages && contextMessages.length > 0) {
            const context = contextMessages.map(msg =>
                `${msg.sender.display_name}: ${msg.content}`
            ).join('\n');

            fullPrompt = `Context from recent chat history:\n${context}\n\nUser Question: ${prompt}\n\nPlease keep your response concise (max 50 words).`;
        }

        return await generateContent(fullPrompt);
    }
}
