
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { loadAppData } from '../app';
import { User } from '../../models/user';
import { Group } from '../../models/group';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../models/user');
jest.mock('../../models/group');

describe('App/LoadData Handler', () => {

    const createEvent = (userId?: string): APIGatewayProxyEvent => ({
        body: JSON.stringify({
            session_variables: userId ? { 'x-hasura-user-id': userId } : undefined
        }),
    } as any);

    const mockContext = {} as Context;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user profile and groups', async () => {
        const userId = 'user-1';
        const mockUser = { id: userId, email: 'test@test.com', display_name: 'Tester' };
        const mockGroups = [{ id: 'g1', name: 'Group 1' }];

        (User.getProfile as jest.Mock).mockResolvedValue(mockUser);
        (Group.listForUser as jest.Mock).mockResolvedValue(mockGroups);

        const event = createEvent(userId);
        const result = await loadAppData(event, mockContext);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);

        expect(body.user_profile).toEqual(mockUser);
        expect(body.groups).toHaveLength(1);
        expect(body.groups[0].id).toBe('g1');
        expect(body.groups[0].unread_count).toBe(0);

        expect(User.getProfile).toHaveBeenCalledWith(userId);
        expect(Group.listForUser).toHaveBeenCalledWith(userId);
    });

    it('should return 404 if user not found', async () => {
        const userId = 'user-1';
        (User.getProfile as jest.Mock).mockResolvedValue(null);

        const event = createEvent(userId);
        const result = await loadAppData(event, mockContext);

        expect(result.statusCode).toBe(404);
        expect(Group.listForUser).not.toHaveBeenCalled();
    });

    it('should return 401 if unauthorized', async () => {
        const event = createEvent(undefined);
        const result = await loadAppData(event, mockContext);

        expect(result.statusCode).toBe(401);
        expect(User.getProfile).not.toHaveBeenCalled();
    });
});
