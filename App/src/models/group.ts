import { execute } from '../utils/hasura';

const CREATE_GROUP_MUTATION = `
    mutation CreateGroup($name: String!, $created_by: uuid!) {
        insert_groups_one(object: {name: $name, created_by: $created_by}) {
            id
        }
    }
`;

const ADD_MEMBERS_MUTATION = `
    mutation AddMembers($objects: [group_members_insert_input!]!) {
        insert_group_members(objects: $objects) {
            affected_rows
        }
    }
`;

const GET_USER_GROUPS_QUERY = `
    query GetUserGroups($user_id: uuid!) {
        group_members(where: {user_id: {_eq: $user_id}}) {
            group {
                id
                name
            }
        }
    }
`;

interface CreateGroupResponse {
    insert_groups_one: { id: string };
}

interface AddMembersResponse {
    insert_group_members: { affected_rows: number };
}

interface GetUserGroupsResponse {
    group_members: {
        group: {
            id: string;
            name: string;
        }
    }[];
}

export class Group {
    static async create(name: string, createdBy: string): Promise<string> {
        const data = await execute<CreateGroupResponse>(CREATE_GROUP_MUTATION, { name, created_by: createdBy });
        return data.insert_groups_one.id;
    }

    static async addMembers(groupId: string, userIds: string[]): Promise<number> {
        if (!userIds || userIds.length === 0) return 0;

        const objects = userIds.map(uid => ({
            group_id: groupId,
            user_id: uid
        }));

        const data = await execute<AddMembersResponse>(ADD_MEMBERS_MUTATION, { objects });
        return data.insert_group_members.affected_rows;
    }

    static async listForUser(userId: string): Promise<{ id: string; name: string }[]> {
        const data = await execute<GetUserGroupsResponse>(GET_USER_GROUPS_QUERY, { user_id: userId });
        return data.group_members.map(gm => gm.group);
    }
}
