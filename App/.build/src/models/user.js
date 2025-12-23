"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const hasura_1 = require("../utils/hasura");
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
class User {
    static async create({ email, display_name, password_hash }) {
        const data = await (0, hasura_1.execute)(INSERT_USER_MUTATION, {
            email,
            display_name,
            password_hash
        });
        return data.insert_users_one;
    }
    static async findByEmail(email) {
        const data = await (0, hasura_1.execute)(GET_USER_BY_EMAIL_QUERY, {
            email,
        });
        return data.users[0] || null;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map