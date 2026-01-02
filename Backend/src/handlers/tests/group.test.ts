
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { createGroup, addMembers } from '../group';
import { Group } from '../../models/group';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// Mock the Group model
jest.mock('../../models/group');

describe('Group Handler', () => {

    // Helper to create event with optional session variables
    const createEvent = (args: any, userId?: string): APIGatewayProxyEvent => ({
        body: JSON.stringify({
            input: {
                input: args
            },
            session_variables: userId ? { 'x-hasura-user-id': userId } : undefined
        }),
    } as any);

    const mockContext = {} as Context;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createGroup', () => {
        it('should create group and return 200 on success', async () => {
            // A. SETUP
            const input = { name: 'My Group', members: ['user2'] };
            const userId = 'user1';

            (Group.create as jest.Mock).mockResolvedValue('group-uuid-123');
            (Group.addMembers as jest.Mock).mockResolvedValue(2); // creator + 1 member

            // B. ACTION
            const event = createEvent(input, userId);
            const result = await createGroup(event, mockContext);

            // C. VERIFY
            expect(result.statusCode).toBe(200);
            const body = JSON.parse(result.body);
            expect(body.group_id).toBe('group-uuid-123');

            // Verify model calls
            expect(Group.create).toHaveBeenCalledWith('My Group', userId);
            // Members should include creator + provided members
            const expectedMembers = ['user1', 'user2'];
            expect(Group.addMembers).toHaveBeenCalledWith('group-uuid-123', expect.arrayContaining(expectedMembers));
        });

        it('should return 401 if unauthorized (no user_id)', async () => {
            const input = { name: 'My Group' };
            const event = createEvent(input); // No userId

            const result = await createGroup(event, mockContext);

            expect(result.statusCode).toBe(401);
            expect(Group.create).not.toHaveBeenCalled();
        });

        it('should return 400 if validation fails (missing name)', async () => {
            const input = { name: '' }; // Invalid
            const userId = 'user1';
            const event = createEvent(input, userId);

            const result = await createGroup(event, mockContext);

            expect(result.statusCode).toBe(400);
            expect(Group.create).not.toHaveBeenCalled();
        });
    });

    describe('addMembers', () => {
        it('should add members and return success', async () => {
            const validGroupId = '123e4567-e89b-12d3-a456-426614174000';
            const input = { group_id: validGroupId, members: ['user2', 'user3'] };

            (Group.addMembers as jest.Mock).mockResolvedValue(2);

            const event = createEvent(input);
            const result = await addMembers(event, mockContext);

            expect(result.statusCode).toBe(200);
            const body = JSON.parse(result.body);
            expect(body.added_count).toBe(2);

            expect(Group.addMembers).toHaveBeenCalledWith(validGroupId, ['user2', 'user3']);
        });

        it('should return 400 if validation fails (invalid uuid)', async () => {
            const input = { group_id: 'not-a-uuid', members: ['user2'] };
            const event = createEvent(input);

            const result = await addMembers(event, mockContext);

            expect(result.statusCode).toBe(400);
            expect(Group.addMembers).not.toHaveBeenCalled();
        });
    });
});
