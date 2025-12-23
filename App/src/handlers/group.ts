import { APIGatewayProxyHandler } from 'aws-lambda';
import { Group } from '../models/group';

export const createGroup: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { name, members } = input?.input || {};
        const { session_variables } = JSON.parse(event.body || '{}');
        const userId = session_variables?.['x-hasura-user-id'];

        if (!name) {
            return { statusCode: 400, body: JSON.stringify({ message: "Name is required" }) };
        }
        if (!userId) {
            return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
        }

        // 1. Create Group
        const groupId = await Group.create(name, userId);

        // 2. Add creator and other members
        const membersToAdd = new Set<string>([userId]);
        if (members && Array.isArray(members)) {
            members.forEach((m: string) => membersToAdd.add(m));
        }

        await Group.addMembers(groupId, Array.from(membersToAdd));

        return {
            statusCode: 200,
            body: JSON.stringify({ group_id: groupId })
        };

    } catch (e: any) {
        return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
    }
};

export const addMembers: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { group_id, members } = input?.input || {};

        if (!group_id || !members || !Array.isArray(members)) {
            return { statusCode: 400, body: JSON.stringify({ message: "Invalid input" }) };
        }

        const addedCount = await Group.addMembers(group_id, members);

        return {
            statusCode: 200,
            body: JSON.stringify({ added_count: addedCount })
        };
    } catch (e: any) {
        return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
    }
};
