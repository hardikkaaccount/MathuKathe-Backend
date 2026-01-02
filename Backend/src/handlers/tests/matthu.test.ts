
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { handler } from '../matthu';
import { Message } from '../../models/message';
import { MatthuModel } from '../../models/matthu';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/message');
jest.mock('../../models/matthu');

describe('Matthu Handler', () => {

    const createEvent = (args: any): APIGatewayProxyEvent => ({
        body: JSON.stringify({
            input: {
                input: args
            }
        }),
    } as any);

    const mockContext = {} as Context;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should answer question utilizing group context if group_id provided', async () => {
        const validGroupId = '123e4567-e89b-12d3-a456-426614174000';
        const input = { prompt: 'Hello?', group_id: validGroupId };

        (Message.fetchRecent as jest.Mock).mockResolvedValue(['msg1', 'msg2']);
        (MatthuModel.answerQuestion as jest.Mock).mockResolvedValue('Hello Human!');

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.answer).toBe('Hello Human!');

        expect(Message.fetchRecent).toHaveBeenCalledWith(validGroupId, 10);
        expect(MatthuModel.answerQuestion).toHaveBeenCalledWith('Hello?', ['msg1', 'msg2']);
    });

    it('should answer question without context if no group_id', async () => {
        const input = { prompt: 'Meaning of life?' };

        (MatthuModel.answerQuestion as jest.Mock).mockResolvedValue('42');

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).answer).toBe('42');

        expect(Message.fetchRecent).not.toHaveBeenCalled();
        expect(MatthuModel.answerQuestion).toHaveBeenCalledWith('Meaning of life?', []);
    });

    it('should return 400 if validation fails (missing prompt)', async () => {
        const input = { group_id: 'some-id' }; // Missing prompt
        const event = createEvent(input);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(MatthuModel.answerQuestion).not.toHaveBeenCalled();
    });
});
