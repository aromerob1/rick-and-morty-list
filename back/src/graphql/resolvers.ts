import * as characterService from '../services/character.service';
import { MyContext } from './context';

interface CharactersArgs {
  filter?: {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    originName?: string;
    starred?: boolean;
  };
  sortByName?: string;
}

interface UpdateStarredArgs {
  id: string;
  starred: boolean;
}

export const resolvers = {
  Query: {
    character: async (
      _: any,
      args: { id: string },
      context: MyContext
    ): Promise<any> => {
      const character = await characterService.findCharacterById(
        args.id,
        context.redis
      );
      return character;
    },

    characters: async (
      _: any,
      args: CharactersArgs,
      context: MyContext
    ): Promise<any> => {
      const filter = args.filter;
      const sortByName = args.sortByName;
      const charactersData = await characterService.findCharacters(
        { filter, sortByName },
        context.redis
      );
      return charactersData;
    },
  },
  Mutation: {
    updateCharacterStarred: async (
      _: any,
      args: UpdateStarredArgs,
      context: MyContext
    ): Promise<any> => {
      console.log(`[Resolver] Executing mutation with args: `, args);
      const updatedCharacter = await characterService.updateStarredStatus(
        args.id,
        args.starred,
        context.redis
      );

      if (!updatedCharacter) {
        console.log(`[Resolver] Character ${args.id} not found`);
      }
      return updatedCharacter;
    },
  },
};
