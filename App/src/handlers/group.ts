import { z } from 'zod';
import { Group } from '../models/group';
import { apiHandler } from '../middlewares/apiHandler';

// Define schemas
const createGroupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    members: z.array(z.string()).optional(),
});

const addMembersSchema = z.object({
    group_id: z.string().uuid(),
    members: z.array(z.string()).min(1, "At least one member is required"),
});

export const createGroup = apiHandler({ schema: createGroupSchema, requireAuth: true }, async (event, context, { body, user_id }) => {
    const { name, members } = body;
    // user_id is guaranteed by requireAuth: true
    const creatorId = user_id!;

    // 1. Create Group
    const groupId = await Group.create(name, creatorId);

    // 2. Add members
    const membersToAdd = new Set<string>([creatorId]);
    if (members && Array.isArray(members)) {
        members.forEach((m: string) => membersToAdd.add(m));
    }
    await Group.addMembers(groupId, Array.from(membersToAdd));

    return {
        statusCode: 200,
        body: JSON.stringify({ group_id: groupId })
    };
});

export const addMembers = apiHandler({ schema: addMembersSchema }, async (event, context, { body }) => {
    const { group_id, members } = body;

    const addedCount = await Group.addMembers(group_id, members);

    return {
        statusCode: 200,
        body: JSON.stringify({ added_count: addedCount })
    };
});
