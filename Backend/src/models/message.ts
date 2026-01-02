import { execute } from '../utils/hasura';
import { GET_MESSAGES_BY_GROUP_AND_DATE, GET_RECENT_MESSAGES, INSERT_MESSAGE_MUTATION } from '../queries/message';
import { MessageData, GetMessagesResponse } from '../types/message';

interface InsertMessageResponse {
  insert_messages_one: MessageData;
}

export class Message {
  static async create(groupId: string, senderId: string, content: string): Promise<MessageData> {
    const data = await execute<InsertMessageResponse>(INSERT_MESSAGE_MUTATION, {
      group_id: groupId,
      sender_id: senderId,
      content: content
    });
    return data.insert_messages_one;
  }

  static async fetchByGroupAndDateRange(groupId: string, fromDate: string, toDate: string): Promise<MessageData[]> {
    console.log(`Fetching messages for group ${groupId} from ${fromDate} to ${toDate}`);
    const data = await execute<GetMessagesResponse>(GET_MESSAGES_BY_GROUP_AND_DATE, {
      group_id: groupId,
      from_date: fromDate,
      to_date: toDate,
    });
    return data.messages || [];
  }

  static async fetchRecent(groupId: string, limit: number): Promise<MessageData[]> {
    const data = await execute<GetMessagesResponse>(GET_RECENT_MESSAGES, {
      group_id: groupId,
      limit: limit
    });
    // Reverse to chronological order (oldest first) for context
    return (data.messages || []).reverse();
  }
}
