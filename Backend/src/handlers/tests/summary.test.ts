
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { handler } from '../summary';
import { Message } from '../../models/message';
import { SummaryModel } from '../../models/summary';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/message');
jest.mock('../../models/summary');

describe('Summary Handler', () => {

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

    const validGroupId = '123e4567-e89b-12d3-a456-426614174000';
    const validFrom = '2023-01-01T00:00:00Z';
    const validTo = '2023-01-02T00:00:00Z';

    it('should generate summary for messages', async () => {
        const input = { group_id: validGroupId, from_date: validFrom, to_date: validTo };

        const mockMessages = [
            { created_at: '2023-01-01T10:00:00Z', sender: { display_name: 'Alice' }, content: 'Hi' },
            { created_at: '2023-01-01T10:05:00Z', sender: { display_name: 'Bob' }, content: 'Hello' }
        ];

        (Message.fetchByGroupAndDateRange as jest.Mock).mockResolvedValue(mockMessages);
        (SummaryModel.generate as jest.Mock).mockResolvedValue('Chat summary here');

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).summary).toBe('Chat summary here');

        expect(Message.fetchByGroupAndDateRange).toHaveBeenCalledWith(validGroupId, validFrom, validTo);
        const expectedFormatted = `2023-01-01T10:00:00Z - Alice: Hi\n2023-01-01T10:05:00Z - Bob: Hello`;
        expect(SummaryModel.generate).toHaveBeenCalledWith(expectedFormatted);
    });

    it('should return no messages message if empty', async () => {
        const input = { group_id: validGroupId, from_date: validFrom, to_date: validTo };

        (Message.fetchByGroupAndDateRange as jest.Mock).mockResolvedValue([]);

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).summary).toBe('No messages found in the specified period.');

        expect(SummaryModel.generate).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
        const input = { group_id: validGroupId, from_date: 'invalid-date', to_date: validTo };
        const event = createEvent(input);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(Message.fetchByGroupAndDateRange).not.toHaveBeenCalled();
    });
});
