import { Link, useParams } from 'react-router-dom';
import BackIcon from '../assets/icons/BackIcon.svg?react';
import { useQuery } from '@apollo/client';
import DetailedHeartIcon from '../assets/icons/DetailedHeart.svg';
import { GET_CHARACTER_DETAIL_QUERY } from '../graphql/queries';

export default function CharacterDetailPage() {
  const { characterId } = useParams<{ characterId: string }>();
  console.log('Character ID:', characterId);

  const { loading, error, data } = useQuery(GET_CHARACTER_DETAIL_QUERY, {
    variables: { id: characterId },
    skip: !characterId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!data?.character) return <p>Not found.</p>;

  console.log('Character Data:', data.character);
  const character = data.character;

  return (
    <section className="flex flex-col px-6">
      <div className="pb-4">
        <nav className="py-6.5">
          <Link to="/">
            <BackIcon />
          </Link>
        </nav>
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
