import { gql } from '@apollo/client';

export const GET_CHARACTERS_QUERY = gql`
  query GetCharacters(
    $filter: FilterCharacterInput
    $sortByName: SortDirection
  ) {
    characters(filter: $filter, sortByName: $sortByName) {
      id
      name
      status
      species
      image
      starred
    }
  }
`;

export const GET_CHARACTER_DETAIL_QUERY = gql`
  query GetCharacterDetail($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      originName
      locationName
      image
      starred
      createdAt
      updatedAt
    }
  }
`;
