import { execute } from '../utils/hasura';

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

interface MessageData {
  content: string;
  sender: {
    display_name: string;
  };
  created_at: string;
}

interface GetMessagesResponse {
  messages: MessageData[];
}

export class Message {
  static async fetchByGroupAndDateRange(groupId: string, fromDate: string, toDate: string): Promise<MessageData[]> {
    console.log(`Fetching messages for group ${groupId} from ${fromDate} to ${toDate}`);
    const data = await execute<GetMessagesResponse>(GET_MESSAGES_QUERY, {
      group_id: groupId,
      from_date: fromDate,
      to_date: toDate,
    });
    return data.messages || [];
  }

  static async fetchRecent(groupId: string, limit: number): Promise<MessageData[]> {
    const data = await execute<GetMessagesResponse>(GET_RECENT_MESSAGES_QUERY, {
      group_id: groupId,
      limit: limit
    });
    // Reverse to chronological order (oldest first) for context
    return (data.messages || []).reverse();
  }
}
