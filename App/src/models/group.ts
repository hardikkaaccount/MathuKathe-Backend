import { execute } from '../utils/hasura';
import { CREATE_GROUP_MUTATION, ADD_MEMBERS_MUTATION, GET_USER_GROUPS_QUERY } from '../queries/group';
import { CreateGroupResponse, AddMembersResponse, GetUserGroupsResponse } from '../types/group';

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
