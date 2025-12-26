import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("process.env.GOOGLE_API_KEY", process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// ... generateContent implementation ...

export async function generateContent(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

/**
 * @deprecated Use generateContent or appropriate Model instead. Kept for backward compatibility.
 */
export async function generateResponse(prompt: string): Promise<string> {
    return generateContent(prompt);
}
