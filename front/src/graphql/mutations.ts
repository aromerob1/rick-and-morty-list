import { gql } from '@apollo/client';

export const SET_STARRED_MUTATION = gql`
  mutation SetStarred($id: ID!, $starred: Boolean!) {
    updateCharacterStarred(id: $id, starred: $starred) {
      id
      name
      status
      species
      type
      image
      starred
    }
  }
`;
