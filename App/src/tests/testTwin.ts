import { execute } from "../utils/hasura";

export async function testTwin() {
    console.log("Testing AI Twin Reply...");
    try {
        // 1. Create a group for context
        const randomSuffix = Math.random().toString(36).substring(7);
        // Using a new email every time to ensure unique user creation
        const email = `twin_tester_${randomSuffix}@example.com`;

        console.log("Creating user...");
        const user = await import("../models/user").then(m => m.User.create({ email, display_name: "TwinTester", password_hash: "hash" }));

        if (!user || !user.id) {
            throw new Error("Failed to create user");
        }
        const safeUserId = user.id;

        const INSERT_GROUP_MUTATION = `
            mutation InsertGroup($name: String!, $created_by: uuid!) {
                insert_groups_one(object: {name: $name, created_by: $created_by}) {
                    id
                }
            }
        `;
        const groupResult: any = await execute(INSERT_GROUP_MUTATION, { name: "Twin Test Group", created_by: safeUserId });
        const groupId = groupResult.insert_groups_one.id;
        console.log(`Context Group ID: ${groupId}`);

        // 2. Insert conversation context
        const INSERT_MESSAGE_MUTATION = `
            mutation InsertMessage($content: String!, $group_id: uuid!, $sender_id: uuid!) {
                insert_messages_one(object: {content: $content, group_id: $group_id, sender_id: $sender_id}) {
                    id
                }
            }
        `;

        await execute(INSERT_MESSAGE_MUTATION, { content: "Hey, do you want to go grab lunch?", group_id: groupId, sender_id: safeUserId });
        await execute(INSERT_MESSAGE_MUTATION, { content: "I was thinking about pizza.", group_id: groupId, sender_id: safeUserId });

        // 3. Trigger AI Twin
        console.log("Requesting Twin Reply...");
        const TWIN_REPLY_MUTATION = `
            mutation TwinReply($group_id: uuid!) {
                ai_twin_reply(input: {group_id: $group_id}) {
                    reply
                }
            }
        `;

        const result: any = await execute(TWIN_REPLY_MUTATION, { group_id: groupId });
        console.log("Twin Response:", JSON.stringify(result, null, 2));

        if (result && result.ai_twin_reply && result.ai_twin_reply.reply) {
            console.log("SUCCESS: Reply received.");
            console.log("Reply:", result.ai_twin_reply.reply);
        } else {
            console.error("FAILURE: No reply in response.");
            process.exit(1);
        }

    } catch (err) {
        console.error("ERROR executing twin reply:", err);
        process.exit(1);
    }
}
