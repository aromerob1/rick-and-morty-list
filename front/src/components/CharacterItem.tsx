import { Link } from 'react-router-dom';
import LikeHeart from './LikeHeart';
import { gql, useMutation } from '@apollo/client';

const SET_STARRED_MUTATION = gql`
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

const GET_CHARACTERS_QUERY = gql`
  query GetCharacters($filter: FilterCharacterInput) {
    characters(filter: $filter) {
      id
      name
      status
      species
      image
      starred
    }
  }
`;

interface CharacterItemProps {
  character: never;
  onSelect: (id: string | number) => void;
  isSelected: boolean;
}

export default function CharacterItem({
  character,
  onSelect,
  isSelected,
}: CharacterItemProps) {
  const { id, name, species, image, starred } = character;

  const [updateStarred, { loading: updatingStarred }] =
    useMutation(SET_STARRED_MUTATION, {
      refetchQueries: [
        {
          query: GET_CHARACTERS_QUERY,
          variables: { filter: { starred: false } },
        },
        {
          query: GET_CHARACTERS_QUERY,
          variables: { filter: { starred: true } },
        },
      ],
    });

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isDesktop) {
      event.preventDefault();
      onSelect(id);
    }
  };

  const handleStarClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(`Cambiando starred para ${id} a ${!starred}`);

    try {
      await updateStarred({ variables: { id: id, starred: !starred } });
      console.log(`Mutación ejecutada para ${id}`);
    } catch (err) {
      console.error(`Error en la mutación para ${id}:`, err);
    }
  };

  return (
    <Link
      to={`character/${id}`}
      onClick={handleClick}
      className={`flex items-center justify-between py-4 rounded-lg ${isSelected ? 'bg-primary-100' : ''}`}
    >
      <div className="flex items-center">
        <img
          src={image}
          alt="Character image"
          className="w-8 h-8 rounded-full mr-4"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-500">{species}</p>
        </div>
      </div>
      <LikeHeart
        isSelected={isSelected}
        isStarred={starred}
        onClick={handleStarClick}
        disabled={updatingStarred}
      />
    </Link>
  );
}
