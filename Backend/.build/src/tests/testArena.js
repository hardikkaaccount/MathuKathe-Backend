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
exports.testArena = testArena;
const hasura_1 = require("../utils/hasura");
async function testArena() {
    console.log("Testing Arena (Truth or Dare)...");
    try {
        // 1. Create a group
        const randomSuffix = Math.random().toString(36).substring(7);
        const email = `arena_tester_${randomSuffix}@example.com`;
        console.log("Creating user (group creator)...");
        const user = await Promise.resolve().then(() => __importStar(require("../models/user"))).then(m => m.User.create({ email, display_name: "ArenaCreator", password_hash: "hash" }));
        const creatorId = user.id;
        const INSERT_GROUP_MUTATION = `
            mutation InsertGroup($name: String!, $created_by: uuid!) {
                insert_groups_one(object: {name: $name, created_by: $created_by}) {
                    id
                }
            }
        `;
        const groupResult = await (0, hasura_1.execute)(INSERT_GROUP_MUTATION, { name: "Arena Test Group", created_by: creatorId });
        const groupId = groupResult.insert_groups_one.id;
        console.log(`Arena Group ID: ${groupId}`);
        // 2. Create helper users to be members
        const memberIds = [creatorId];
        for (let i = 0; i < 3; i++) {
            const memberEmail = `arena_member_${i}_${randomSuffix}@example.com`;
            const memberUser = await Promise.resolve().then(() => __importStar(require("../models/user"))).then(m => m.User.create({ email: memberEmail, display_name: `Member${i}`, password_hash: "hash" }));
            if (memberUser && memberUser.id) {
                memberIds.push(memberUser.id);
            }
        }
        console.log(`Playing with members: ${memberIds.join(', ')}`);
        // 3. Trigger Arena Action
        const ARENA_MUTATION = `
            mutation Arena($group_id: uuid!, $members: [uuid!]!) {
                arena(input: {group_id: $group_id, members: $members}) {
                    challenger_id
                    player_id
                }
            }
        `;
        const result = await (0, hasura_1.execute)(ARENA_MUTATION, { group_id: groupId, members: memberIds });
        console.log("Arena Result:", JSON.stringify(result, null, 2));
        if (result && result.arena) {
            const { challenger_id, player_id } = result.arena;
            if (challenger_id && player_id && challenger_id !== player_id) {
                console.log("SUCCESS: Two distinct members selected.");
                console.log(`Challenger: ${challenger_id}`);
                console.log(`Player: ${player_id}`);
            }
            else {
                console.error("FAILURE: Challenger and Player are invalid or same.");
                process.exit(1);
            }
        }
        else {
            console.error("FAILURE: No arena result.");
            process.exit(1);
        }
    }
    catch (err) {
        console.error("ERROR executing arena:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=testArena.js.map