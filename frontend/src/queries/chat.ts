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
    mutation CreateGroup($name: String!) {
        create_group(input: {name: $name}) {
            group_id
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
