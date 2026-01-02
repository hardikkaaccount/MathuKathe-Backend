
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { handler } from '../twin';
import { Message } from '../../models/message';
import { TwinModel } from '../../models/twin';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/message');
jest.mock('../../models/twin');

describe('Twin Handler', () => {

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

    it('should generate twin reply based on recent messages', async () => {
        const validGroupId = '123e4567-e89b-12d3-a456-426614174000';
        const input = { group_id: validGroupId };

        (Message.fetchRecent as jest.Mock).mockResolvedValue(['msg1', 'msg2']);
        (TwinModel.generateReply as jest.Mock).mockResolvedValue('Twin says hi!');

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).reply).toBe('Twin says hi!');

        expect(Message.fetchRecent).toHaveBeenCalledWith(validGroupId, 10);
        expect(TwinModel.generateReply).toHaveBeenCalledWith(['msg1', 'msg2']);
    });

    it('should return 400 if validation fails (invalid uuid)', async () => {
        const input = { group_id: 'not-a-uuid' };
        const event = createEvent(input);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(Message.fetchRecent).not.toHaveBeenCalled();
    });
});
