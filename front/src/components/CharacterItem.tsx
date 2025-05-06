import { Link } from 'react-router-dom';
import LikeHeart from './LikeHeart';
import { useMutation } from '@apollo/client';
import { SET_STARRED_MUTATION } from '../graphql/mutations';
import { GET_CHARACTERS_QUERY } from '../graphql/queries';
import { CharacterItemProps } from '../types/index';

export default function CharacterItem({
  character,
  onSelect,
  isSelected,
}: CharacterItemProps) {
  const { id, name, species, image, starred } = character;

  const [updateStarred, { loading: updatingStarred }] = useMutation(
    SET_STARRED_MUTATION,
    {
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
    }
  );

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

    try {
      await updateStarred({ variables: { id: id, starred: !starred } });
      console.log(`Mutation for: ${id}`);
    } catch (err) {
      console.error(`Error in mutation: ${id}:`, err);
    }
  };

  return (
    <Link
      to={`character/${id}`}
      onClick={handleClick}
      className={`flex items-center justify-between py-4 rounded-lg transition-all duration-150 ease-in-out ${
        isSelected ? 'bg-primary-100 -mx-2 px-2 shadow-md' : 'hover:bg-gray-100'
      }`}
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
