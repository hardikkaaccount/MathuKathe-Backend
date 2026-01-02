
process.env.HASURA_GRAPHQL_ID = 'http://localhost:8080';
process.env.HASURA_ADMIN_SECRET = 'admin';

import { Group } from '../group';
import { execute } from '../../utils/hasura';
import { CREATE_GROUP_MUTATION, ADD_MEMBERS_MUTATION } from '../../queries/group';

jest.mock('../../utils/hasura');

describe('Group Model', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('create should execute CREATE_GROUP_MUTATION', async () => {
        const mockResponse = {
            insert_groups_one: { id: 'group-123' }
        };
        (execute as jest.Mock).mockResolvedValue(mockResponse);

        const id = await Group.create('My Group', 'user-1');

        expect(id).toBe('group-123');
        expect(execute).toHaveBeenCalledWith(CREATE_GROUP_MUTATION, { name: 'My Group', created_by: 'user-1' });
    });

    it('addMembers should execute ADD_MEMBERS_MUTATION', async () => {
        const mockResponse = {
            insert_group_members: { affected_rows: 2 }
        };
        (execute as jest.Mock).mockResolvedValue(mockResponse);

        const affected = await Group.addMembers('group-123', ['user-2', 'user-3']);

        expect(affected).toBe(2);
        expect(execute).toHaveBeenCalledWith(ADD_MEMBERS_MUTATION, {
            objects: [
                { group_id: 'group-123', user_id: 'user-2' },
                { group_id: 'group-123', user_id: 'user-3' }
            ]
        });
    });

    it('addMembers should return 0 if no users provided', async () => {
        const affected = await Group.addMembers('group-123', []);
        expect(affected).toBe(0);
        expect(execute).not.toHaveBeenCalled();
    });
});
