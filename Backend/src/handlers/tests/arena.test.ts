
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { handler } from '../arena';
import { ArenaModel } from '../../models/arena';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/arena');

describe('Arena Handler', () => {

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

    it('should select contestants from members', async () => {
        const input = { members: ['Bob', 'Alice', 'Eve'] };
        const mockContestants = { player1: 'Bob', player2: 'Alice' };

        (ArenaModel.selectContestants as jest.Mock).mockReturnValue(mockContestants);

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockContestants);

        expect(ArenaModel.selectContestants).toHaveBeenCalledWith(['Bob', 'Alice', 'Eve']);
    });

    it('should return 400 if validation fails (less than 2 members)', async () => {
        const input = { members: ['Bob'] };
        const event = createEvent(input);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(ArenaModel.selectContestants).not.toHaveBeenCalled();
    });
});
