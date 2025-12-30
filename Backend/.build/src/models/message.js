"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const hasura_1 = require("../utils/hasura");
const GET_MESSAGES_QUERY = `
  query GetMessages($group_id: uuid!, $from_date: timestamptz!, $to_date: timestamptz!) {
    messages(
      where: {
        group_id: { _eq: $group_id },
        created_at: { _gte: $from_date, _lte: $to_date }
      }
      order_by: { created_at: asc }
    ) {
      content
      sender {
        display_name
      }
      created_at
    }
  }
`;
const GET_RECENT_MESSAGES_QUERY = `
    query GetRecentMessages($group_id: uuid!, $limit: Int!) {
        messages(
            where: { group_id: { _eq: $group_id } }
            order_by: { created_at: desc }
            limit: $limit
        ) {
            content
            sender { display_name }
            created_at
        }
    }
`;
class Message {
    static async fetchByGroupAndDateRange(groupId, fromDate, toDate) {
        console.log(`Fetching messages for group ${groupId} from ${fromDate} to ${toDate}`);
        const data = await (0, hasura_1.execute)(GET_MESSAGES_QUERY, {
            group_id: groupId,
            from_date: fromDate,
            to_date: toDate,
        });
        return data.messages || [];
    }
    static async fetchRecent(groupId, limit) {
        const data = await (0, hasura_1.execute)(GET_RECENT_MESSAGES_QUERY, {
            group_id: groupId,
            limit: limit
        });
        // Reverse to chronological order (oldest first) for context
        return (data.messages || []).reverse();
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map