import { execute } from '../utils/hasura';

const INSERT_USER_MUTATION = `
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

const GET_USER_BY_EMAIL_QUERY = `
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      password_hash
    }
  }
`;

interface CreateUserArgs {
  email: string;
  display_name: string;
  password_hash: string;
}

interface UserData {
  id: string;
  password_hash: string;
}

interface InsertUserResponse {
  insert_users_one: UserData;
}

interface GetUsersResponse {
  users: UserData[];
}

export class User {
  static async create({ email, display_name, password_hash }: CreateUserArgs): Promise<UserData> {
    const data = await execute<InsertUserResponse>(INSERT_USER_MUTATION, {
      email,
      display_name,
      password_hash
    });
    return data.insert_users_one;
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    const data = await execute<GetUsersResponse>(
      GET_USER_BY_EMAIL_QUERY,
      {
        email,
      }
    );
    return data.users[0] || null;
  }
}
