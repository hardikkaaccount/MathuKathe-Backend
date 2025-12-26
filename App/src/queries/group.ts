export const CREATE_GROUP_MUTATION = `
    mutation CreateGroup($name: String!, $created_by: uuid!) {
        insert_groups_one(object: {name: $name, created_by: $created_by}) {
            id
        }
    }
`;

export const ADD_MEMBERS_MUTATION = `
    mutation AddMembers($objects: [group_members_insert_input!]!) {
        insert_group_members(objects: $objects) {
            affected_rows
        }
    }
`;

export const GET_USER_GROUPS_QUERY = `
    query GetUserGroups($user_id: uuid!) {
        group_members(where: {user_id: {_eq: $user_id}}) {
            group {
                id
                name
            }
        }
    }
`;
