"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGroups = testGroups;
const hasura_1 = require("../utils/hasura");
async function testGroups() {
    console.log("Testing Group Management...");
    try {
        const randomSuffix = Math.random().toString(36).substring(7);
        const creatorEmail = `group_creator_${randomSuffix}@example.com`;
        console.log("Creating creator user...");
        const creator = await Promise.resolve().then(() => __importStar(require("../models/user"))).then(m => m.User.create({ email: creatorEmail, display_name: "GroupCreator", password_hash: "hash" }));
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
        const createResult = await (0, hasura_1.execute)(CREATE_GROUP_ACTION, { name: "Action Test Group", members: [] }, undefined, { 'x-hasura-user-id': creator.id });
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
            const mUser = await Promise.resolve().then(() => __importStar(require("../models/user"))).then(m => m.User.create({ email: mEmail, display_name: `Member_${i}`, password_hash: "hash" }));
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
        const addResult = await (0, hasura_1.execute)(ADD_MEMBERS_ACTION, { group_id: groupId, members: memberIds });
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
        const loadResult = await (0, hasura_1.execute)(LOAD_DATA_QUERY, {}, undefined, { 'x-hasura-user-id': creator.id });
        console.log("Load Data Result:", JSON.stringify(loadResult, null, 2));
        const groups = loadResult.load_app_data.groups;
        const foundGroup = groups.find((g) => g.id === groupId);
        if (foundGroup) {
            console.log("SUCCESS: Group found in load_app_data.");
        }
        else {
            throw new Error("Group not found in load_app_data");
        }
    }
    catch (err) {
        console.error("ERROR executing Group Tests:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=testGroups.js.map