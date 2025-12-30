import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login_user(input: { email: $email, password: $password }) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($email: String!, $display_name: String!, $password: String!) {
    register_user(input: { email: $email, display_name: $display_name, password: $password }) {
      user_id
    }
  }
`;
