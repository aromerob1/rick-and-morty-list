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
export const ADD_COMMENT_MUTATION = gql`
  mutation AddNewComment($characterId: ID!, $commentText: String!) {
    addComment(characterId: $characterId, commentText: $commentText) {
      id
      commentText
      characterId
    }
  }
`;
