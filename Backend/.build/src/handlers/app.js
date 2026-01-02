"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAppData = void 0;
const hasura_1 = require("../utils/hasura");
const group_1 = require("../models/group");
const loadAppData = async (event) => {
    try {
        const { session_variables } = JSON.parse(event.body || '{}');
        const userId = session_variables?.['x-hasura-user-id'];
        if (!userId) {
            return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
        }
        const USER_QUERY = `
            query GetUser($user_id: uuid!) {
                users_by_pk(id: $user_id) {
                    id
                    email
                    display_name
                }
            }
        `;
        const userResult = await (0, hasura_1.execute)(USER_QUERY, { user_id: userId });
        const user = userResult.users_by_pk;
        const groups = await group_1.Group.listForUser(userId);
        const groupSummaries = groups.map(g => ({
            id: g.id,
            name: g.name,
            unread_count: 0
        }));
        return {
            statusCode: 200,
            body: JSON.stringify({
                user_profile: {
                    id: user.id,
                    email: user.email,
                    display_name: user.display_name
                },
                groups: groupSummaries
            })
        };
    }
    catch (e) {
        return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
    }
};
exports.loadAppData = loadAppData;
//# sourceMappingURL=app.js.map