import { execute } from "../utils/hasura";

export async function testGroups() {
    console.log("Testing Group Management...");
    try {
        const randomSuffix = Math.random().toString(36).substring(7);
        const creatorEmail = `group_creator_${randomSuffix}@example.com`;

        console.log("Creating creator user...");
        const creator = await import("../models/user").then(m => m.User.create({ email: creatorEmail, display_name: "GroupCreator", password_hash: "hash" }));

        // 1. Test Create Group
        const CREATE_GROUP_ACTION = `
            mutation CreateGroupAction($name: String!, $members: [uuid!]) {
                create_group(input: {name: $name, members: $members}) {
                    group_id
                }
            }
        `;

        console.log("Testing create_group Action...");
        // Pass empty members initially
        const createResult: any = await execute(CREATE_GROUP_ACTION, { name: "Action Test Group", members: [] }, undefined, { 'x-hasura-user-id': creator.id });
        const groupId = createResult.create_group.group_id;
        console.log(`Created Group ID: ${groupId}`);

        if (!groupId) {
            throw new Error("Failed to create group");
        }

        // 2. Test Add Members
        console.log("Creating member users...");
        const memberIds = [];
        for (let i = 0; i < 2; i++) {
            const mEmail = `group_member_${i}_${randomSuffix}@example.com`;
            const mUser = await import("../models/user").then(m => m.User.create({ email: mEmail, display_name: `Member_${i}`, password_hash: "hash" }));
            memberIds.push(mUser.id);
        }

        const ADD_MEMBERS_ACTION = `
             mutation AddMembersAction($group_id: uuid!, $members: [uuid!]!) {
                 add_members(input: {group_id: $group_id, members: $members}) {
                     added_count
                 }
             }
        `;

        console.log("Testing add_members Action...");
        const addResult: any = await execute(ADD_MEMBERS_ACTION, { group_id: groupId, members: memberIds });
        console.log(`Added Members Count: ${addResult.add_members.added_count}`);

        if (addResult.add_members.added_count !== 2) {
            throw new Error("Failed to add all members");
        }

        // 3. Test Load App Data
        const LOAD_DATA_QUERY = `
            query LoadAppData {
                load_app_data {
                    user_profile {
                        id
                        email
                    }
                    groups {
                        id
                        name
                    }
                }
            }
        `;

        console.log("Testing load_app_data Action...");
        const loadResult: any = await execute(LOAD_DATA_QUERY, {}, undefined, { 'x-hasura-user-id': creator.id });
        console.log("Load Data Result:", JSON.stringify(loadResult, null, 2));

        const groups = loadResult.load_app_data.groups;
        const foundGroup = groups.find((g: any) => g.id === groupId);

        if (foundGroup) {
            console.log("SUCCESS: Group found in load_app_data.");
        } else {
            throw new Error("Group not found in load_app_data");
        }

    } catch (err) {
        console.error("ERROR executing Group Tests:", err);
        process.exit(1);
    }
}
