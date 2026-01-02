
import { MatthuModel } from '../matthu';
import { generateContent } from '../../utils/gemini';

jest.mock('../../utils/gemini');

describe('Matthu Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('answerQuestion should call gemini with prompt only if no context', async () => {
        (generateContent as jest.Mock).mockResolvedValue('Answer');

        const answer = await MatthuModel.answerQuestion('What is X?');

        expect(answer).toBe('Answer');
        expect(generateContent).toHaveBeenCalledWith('What is X?');
    });

    it('answerQuestion should include context in prompt', async () => {
        (generateContent as jest.Mock).mockResolvedValue('Answer');
        const context = [{ sender: { display_name: 'Alice' }, content: 'Hello' }];

        await MatthuModel.answerQuestion('What did Alice say?', context);

        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Context from recent chat history'));
        expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Alice: Hello'));
    });
});
