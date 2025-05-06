import { Link, useParams } from 'react-router-dom';
import BackIcon from '../assets/icons/BackIcon.svg?react';
import { useQuery } from '@apollo/client';
import { GET_CHARACTER_DETAIL_QUERY } from '../graphql/queries';
import CharacterDetailView from '../components/CharacterDetailView';

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
        <nav className="py-6.5">
          <Link to="/">
            <BackIcon />
          </Link>
        </nav>
        <CharacterDetailView characterId={character.id} />

    </section>
  );
}
