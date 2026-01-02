import { generateContent } from '../gemini';

// 1. DEFINE THE SCRIPT BEFORE THE MOVIE STARTS
// We need to define these variables here so we can control them inside the test later
const mockResponseText = jest.fn();
const mockGenerateContent = jest.fn().mockReturnValue({
    response: {
        text: mockResponseText
    }
});
const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent
});

// 2. "MANUFACTURING THE ROBOT":
// We are building a fake 'GoogleGenerativeAI' class.
// Real Class: connects to Google.
// Fake Class: returns our 'mockGetGenerativeModel' robot.
jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn(() => ({
            getGenerativeModel: mockGetGenerativeModel
        }))
    };
});

describe('Gemini AI Utility', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return text from Google AI', async () => {
        // 3. SET THE SCENE
        mockResponseText.mockReturnValue("I am a robot");

        // 4. ACTION
        const result = await generateContent("Hello");

        // 5. REVIEW
        expect(result).toBe("I am a robot");
        expect(mockGetGenerativeModel).toHaveBeenCalled();
        expect(mockGenerateContent).toHaveBeenCalledWith("Hello");
    });
});
