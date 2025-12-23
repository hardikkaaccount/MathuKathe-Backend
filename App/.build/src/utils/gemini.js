"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
exports.generateResponse = generateResponse;
const generative_ai_1 = require("@google/generative-ai");
console.log("process.env.GOOGLE_API_KEY", process.env.GOOGLE_API_KEY);
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
async function generateSummary(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const prompt = `Please provide a concise summary of the following chat messages:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    return summary;
}
async function generateResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
//# sourceMappingURL=gemini.js.map