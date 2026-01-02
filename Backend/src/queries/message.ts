export const GET_MESSAGES_BY_GROUP_AND_DATE = `
  query GetMessagesByGroupAndDate($group_id: uuid!, $from_date: timestamptz!, $to_date: timestamptz!) {
    messages(
      where: {
        group_id: { _eq: $group_id },
        created_at: { _gte: $from_date, _lte: $to_date }
      }
      order_by: { created_at: asc }
    ) {
      id
      content
      created_at
      sender {
        display_name
      }
    }
  }
`;

export const GET_RECENT_MESSAGES = `
    query GetRecentMessages($group_id: uuid!, $limit: Int!) {
        messages(
            where: { group_id: { _eq: $group_id } }
            order_by: { created_at: desc }
            limit: $limit
        ) {
            id
            content
            sender { display_name }
            created_at
        }
    }
`;

export const INSERT_MESSAGE_MUTATION = `
    mutation InsertMessage($group_id: uuid!, $sender_id: uuid!, $content: String!) {
        insert_messages_one(object: {
            group_id: $group_id, 
            sender_id: $sender_id, 
            content: $content
        }) {
            id
            content
            created_at
        }
    }
`;
