import { gql } from "@apollo/client";

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($search: String!) {
    users(where: { display_name: { _ilike: $search } }, limit: 10) {
      id
      display_name
      email
    }
  }
`;
