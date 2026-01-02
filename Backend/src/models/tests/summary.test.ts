
import { SummaryModel } from '../summary';
import { generateContent } from '../../utils/gemini';

jest.mock('../../utils/gemini');

describe('Summary Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('generate should call gemini with summary prompt', async () => {
        (generateContent as jest.Mock).mockResolvedValue('Summary');
        const chat = 'Bob: Hi\nAlice: Hello';

        const summary = await SummaryModel.generate(chat);

        expect(summary).toBe('Summary');
        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Please provide a concise summary'));
        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining(chat));
    });
});
