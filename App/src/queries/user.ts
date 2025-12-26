export const INSERT_USER_MUTATION = `
  mutation InsertUser($email: String!, $display_name: String!, $password_hash: String!) {
    insert_users_one(object: {
      email: $email,
      display_name: $display_name,
      password_hash: $password_hash
    }) {
      id
      password_hash
    }
  }
`;

export const GET_USER_BY_EMAIL_QUERY = `
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      password_hash
    }
  }
`;

export const GET_USER_BY_ID_QUERY = `
  query GetUser($id: uuid!) {
    users_by_pk(id: $id) {
        id
        email
        display_name
        password_hash
    }
  }
`;
