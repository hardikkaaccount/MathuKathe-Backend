import { gql } from '@apollo/client';

export const GET_USER_GROUPS_QUERY = gql`
    query GetUserGroups($user_id: uuid!) {
        group_members(where: {user_id: {_eq: $user_id}}) {
            group {
                id
                name
            }
        }
    }
`;

export const GET_RECENT_MESSAGES_QUERY = gql`
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

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($group_id: uuid!, $content: String!) {
        insert_messages_one(object: {group_id: $group_id, content: $content}) {
            id
            created_at
            content
            sender {
                display_name
            }
        }
    }
`;

export const CREATE_GROUP_MUTATION = gql`
    mutation CreateGroup($name: String!, $members: [uuid!]) {
        create_group(input: {name: $name, members: $members}) {
            group_id
        }
    }
`;

export const ADD_MEMBERS_ACTION_MUTATION = gql`
    mutation AddMembersAction($group_id: uuid!, $members: [uuid!]!) {
        add_members(input: {group_id: $group_id, members: $members}) {
            added_count
        }
    }
`;

export const LOAD_APP_DATA_QUERY = gql`
    query LoadAppData {
        load_app_data {
            user_profile {
                id
                display_name
                email
            }
            groups {
                id
                name
                unread_count
            }
        }
    }
`;

export const UPDATE_GROUP_DESCRIPTION_MUTATION = gql`
    mutation UpdateGroupDescription($group_id: uuid!, $description: String!) {
        update_groups_by_pk(pk_columns: {id: $group_id}, _set: {description: $description}) {
            id
            description
        }
    }
`;

export const ADD_MEMBER_TO_GROUP_MUTATION = gql`
    mutation AddMemberToGroup($group_id: uuid!, $user_id: uuid!) {
        insert_group_members_one(object: {group_id: $group_id, user_id: $user_id}) {
            group_id
            user_id
        }
    }
`;

export const GET_MESSAGES_SUBSCRIPTION = gql`
    subscription GetMessages($group_id: uuid!) {
        messages(
            where: { group_id: { _eq: $group_id } }
            order_by: { created_at: desc }
            limit: 50
        ) {
            id
            content
            sender { display_name }
            created_at
        }
    }
`;

export const GET_GROUP_DETAILS_QUERY = gql`
    query GetGroupDetails($group_id: uuid!) {
        groups_by_pk(id: $group_id) {
            id
            name
            description
            created_at
            creator {
                display_name
            }
            members {
                user {
                    id
                    display_name
                }
            }
        }
    }
`;

export const EXPLORE_GROUPS_QUERY = gql`
    query ExploreGroups($search: String, $limit: Int, $user_id: uuid!) {
        groups(
            where: { name: { _ilike: $search } }
            limit: $limit
            order_by: { created_at: desc }
        ) {
            id
            name
            description
            created_at
            members_aggregate {
                aggregate {
                    count
                }
            }
            am_i_member: members(where: {user_id: {_eq: $user_id}}) {
                user_id
            }
        }
    }
`;

export const MATTHU_QUERY = gql`
    mutation MatthuQuery($prompt: String!, $group_id: uuid) {
        matthu_query(input: {prompt: $prompt, group_id: $group_id}) {
            answer
        }
    }
`;

export const GENERATE_SUMMARY_MUTATION = gql`
    mutation GenerateSummary($group_id: uuid!, $from_date: String!, $to_date: String!) {
        generate_summary(input: {group_id: $group_id, from_date: $from_date, to_date: $to_date}) {
            summary
        }
    }
`;

export const AI_TWIN_REPLY_MUTATION = gql`
    mutation AiTwinReply($group_id: uuid!) {
        ai_twin_reply(input: {group_id: $group_id}) {
            reply
        }
    }
`;

export const ARENA_MUTATION = gql`
    mutation Arena($group_id: uuid!, $members: [uuid!]!) {
        arena(input: {group_id: $group_id, members: $members}) {
            challenger_id
            player_id
        }
    }
`;
