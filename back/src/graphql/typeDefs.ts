export const typeDefs = `#graphql
  type Character {
    id: ID!
    name: String
    status: String
    species: String
    type: String
    gender: String
    originName: String
    locationName: String
    image: String
    starred: Boolean
    createdAt: String
    updatedAt: String
  }

  input FilterCharacterInput {
    name: String
    status: String
    species: String
    gender: String
    originName: String
    starred: Boolean
  }

  enum SortDirection {
    ASC  
    DESC 
  }

  type Query {
  character(id: ID!): Character
  characters(filter: FilterCharacterInput, sortByName: SortDirection): [Character]
}
    type Mutation {
        updateCharacterStarred(
        id: ID!
        starred: Boolean!
      ): Character 
    }
`;
