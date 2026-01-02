
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { handler } from '../register';
import { User } from '../../models/user';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/user');

describe('Register Handler', () => {

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

    it('should register user and return user_id on success', async () => {
        const input = { email: 'test@example.com', display_name: 'Test User', password: 'password123' };

        (User.register as jest.Mock).mockResolvedValue({ id: 'user-uuid-123' });

        const event = createEvent(input);
        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).user_id).toBe('user-uuid-123');

        expect(User.register).toHaveBeenCalledWith(input);
    });

    it('should return 400 if validation fails (invalid email)', async () => {
        const input = { email: 'not-an-email', display_name: 'Test User', password: 'password123' };
        const event = createEvent(input);

        const result = await handler(event, mockContext);

        expect(result.statusCode).toBe(400);
        expect(User.register).not.toHaveBeenCalled();
    });
});
