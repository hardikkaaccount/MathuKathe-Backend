
import { TwinModel } from '../twin';
import { generateContent } from '../../utils/gemini';

jest.mock('../../utils/gemini');

describe('Twin Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('generateReply should return default message if no context', async () => {
        const reply = await TwinModel.generateReply([]);
        expect(reply).toBe("I don't have enough context to reply yet.");
        expect(generateContent).not.toHaveBeenCalled();
    });

    it('generateReply should call gemini with context', async () => {
        (generateContent as jest.Mock).mockResolvedValue('Reply');
        const messages = [{ sender: { display_name: 'Bob' }, content: 'Hi' }];

        const reply = await TwinModel.generateReply(messages);

        expect(reply).toBe('Reply');
        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('You are an AI assistant'));
        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Bob: Hi'));
    });
});
