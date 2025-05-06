import { useQuery } from '@apollo/client';
import DetailedHeartIcon from '../assets/icons/DetailedHeart.svg';
import { CharacterDetailViewProps } from '../types/index';
import { GET_CHARACTER_DETAIL_QUERY } from '../graphql/queries';

function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
  const { loading, error, data } = useQuery(GET_CHARACTER_DETAIL_QUERY, {
    variables: { id: characterId },
    skip: !characterId,
  });

  if (!characterId) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-center text-gray-500 italic">
        <p>
          Select a character from the list
          <br />
          to view its details.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Cargando detalles...</div>
    );
  }

  if (error) {
    console.error('Error fetching character detail:', error);
    return (
      <div className="p-10 text-center text-red-600">
        Error al cargar: {error.message}
      </div>
    );
  }

  if (!data?.character) {
    return (
      <div className="p-10 text-center text-orange-600">
        Personaje con ID {characterId} no encontrado.
      </div>
    );
  }

  const character = data.character;

  return (
    <section className="flex flex-col pt-[2.5rem] px-[6.25rem]">
      <div className="pb-4">
        <nav className="py-4"></nav>
        <div className="flex flex-col gap-2">
          <div className="relative w-fit h-fit">
            <img src={character.image} className="rounded-full w-[4.688rem]" />
            {character.starred && (
              <img
                src={DetailedHeartIcon}
                className="absolute -right-3 bottom-0"
              />
            )}
          </div>
          <h1 className="font-bold text-2xl">{character.name}</h1>
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-cool-gray-200">
        <li className="py-4">
          <h2 className="font-semibold text-cool-gray-900">Specie</h2>
          <p className="font-medium text-light-text">{character.species}</p>
        </li>
        <li className="py-4">
          <h2 className="font-semibold text-cool-gray-900">Status</h2>
          <p className="font-medium text-light-text">{character.status}</p>
        </li>
        <li className="py-4">
          <h2 className="font-semibold text-cool-gray-900">Origin</h2>
          <p className="font-medium text-light-text">{character.originName}</p>
        </li>
      </ul>
    </section>
  );
}

export default CharacterDetailView;
