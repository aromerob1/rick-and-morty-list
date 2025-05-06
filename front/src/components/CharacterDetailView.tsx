import { useMutation, useQuery } from '@apollo/client';
import DetailedHeartIcon from '../assets/icons/DetailedHeart.svg';
import { CharacterDetailViewProps, CommentType } from '../types/index';
import { GET_CHARACTER_DETAIL_QUERY } from '../graphql/queries';
import { useState } from 'react';
import { ADD_COMMENT_MUTATION } from '../graphql/mutations';

function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
  const {
    loading,
    error,
    data,
    refetch: refetchCharacterDetails,
  } = useQuery(GET_CHARACTER_DETAIL_QUERY, {
    variables: { id: characterId },
    skip: !characterId,
  });

  const [newCommentText, setNewCommentText] = useState('');

  const [addComment, { loading: addingComment, error: addCommentError }] =
    useMutation(ADD_COMMENT_MUTATION, {
      onCompleted: () => {
        console.log('Comment added successfully');
        refetchCharacterDetails();
        setNewCommentText('');
      },
      onError: (err) => {
        console.error('Error trying to add comment: ', err.message);
      },
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
      <div className="p-10 text-center text-gray-500">Loading details...</div>
    );
  }

  if (error) {
    console.error('Error fetching character detail:', error);
    return (
      <div className="p-10 text-center text-red-600">
        Error loading character details.
      </div>
    );
  }

  if (!data?.character) {
    return (
      <div className="p-10 text-center text-orange-600">Chapter not found.</div>
    );
  }

  const character = data.character;
  const comments: CommentType[] = character.comments || [];

  const handleSubmitComment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!newCommentText.trim()) {
      alert('Please enter a comment.');
      return;
    }
    if (!characterId) return;

    console.log(`Submitting comment: ${newCommentText}`);
    try {
      await addComment({
        variables: {
          characterId: characterId,
          commentText: newCommentText.trim(),
        },
      });
    } catch (e) {
      console.error('Failed: ', e);
    }
  };

  return (
    <section className="flex flex-col xl:pt-[2.5rem] xl:px-[6.25rem]">
      <div className="xl:pb-4">
        <nav className="xl:py-4"></nav>
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

      <div className="pt-2 border-t border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Comments ({comments.length})
        </h2>
        {comments.length > 0 ? (
          <ul className="space-y-4 overflow-y-auto max-h-28">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <p className="text-gray-700">{comment.commentText}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">There are no comments yet</p>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-300">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Add Comment
        </h3>
        <form className="pb-12" onSubmit={handleSubmitComment}>
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write your comment here..."
            maxLength={500}
            rows={3}
            className="w-full p-2 rounded-lg resize-none bg-searchbar focus:outline-none"
            disabled={addingComment}
          />
          {addCommentError && (
            <p className="text-light-text text-sm mt-1">
              Error: {addCommentError.message}
            </p>
          )}
          <button
            type="submit"
            disabled={addingComment || !newCommentText.trim()}
            className="mt-3 w-full bg-primary-600 hover:bg-primary-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingComment ? 'Sending...' : 'Add Comment'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CharacterDetailView;
