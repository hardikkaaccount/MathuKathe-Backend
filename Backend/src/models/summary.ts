import { generateContent } from '../utils/gemini';

export class SummaryModel {
    /**
     * Generates a summary for a given list of chat messages.
     * @param messages - Array of formatted message strings or objects?
     * The handler currently formats it as "date - sender: content".
     * Accessing raw messages is better for business logic encapsulation.
     */
    static async generate(chatHistory: string): Promise<string> {
        const prompt = `Please provide a concise summary of the following chat messages:\n\n${chatHistory}`;
        return await generateContent(prompt);
    }
}
