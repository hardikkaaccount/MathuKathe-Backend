import { execute } from '../utils/hasura';
import { INSERT_USER_MUTATION, GET_USER_BY_EMAIL_QUERY, GET_USER_BY_ID_QUERY } from '../queries/user';
import { UserData, LoginInput, RegisterInput, InsertUserResponse, GetUsersResponse } from '../types/user';
import { hashPassword, verifyPassword } from '../utils/password';
import * as jwt from 'jsonwebtoken';

export class User {
  /**
   * Registers a new user with hashed password.
   */
  static async register({ email, display_name, password }: RegisterInput): Promise<UserData> {
    const hashedPassword = await hashPassword(password);

    const data = await execute<InsertUserResponse>(INSERT_USER_MUTATION, {
      email,
      display_name,
      password_hash: hashedPassword
    });

    return data.insert_users_one;
  }

  /**
   * Authenticates a user. Returns UserData if successful, null otherwise.
   */
  static async login({ email, password }: LoginInput): Promise<UserData | null> {
    const data = await execute<GetUsersResponse>(
      GET_USER_BY_EMAIL_QUERY,
      { email }
    );

    const user = data.users[0];
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return user;
  }

  /**
   * Generates a JWT for the user.
   */
  static generateToken(user: UserData): string {
    const HASURA_GRAPHQL_JWT_SECRET = process.env.HASURA_JWT_SECRET || 'secret';

    return jwt.sign(
      {
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-default-role': 'user',
          'x-hasura-user-id': user.id,
        },
      },
      HASURA_GRAPHQL_JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
  static async getProfile(userId: string): Promise<UserData | null> {
    const data = await execute<{ users_by_pk: UserData }>(GET_USER_BY_ID_QUERY, { id: userId });
    return data.users_by_pk || null;
  }
}

