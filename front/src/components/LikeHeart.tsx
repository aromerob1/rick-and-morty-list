import DetailedHeart from '../assets/icons/DetailedHeart.svg?react';
import { LikeHeartProps } from '../types';

export default function LikeHeart({
  isStarred,
  onClick,
  disabled = false,
  isSelected = false,
}: LikeHeartProps) {
  const baseSvgClasses =
    'w-6 h-6 transition duration-150 ease-in-out transform group-hover:scale-110';

  const conditionalSvgClasses = isStarred
    ? 'text-secondary-600 fill-current'
    : 'text-light-gray fill-none stroke-current hover:text-red-400';

  const buttonClasses = `p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 ${
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  }`;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group ${buttonClasses}`}
      aria-label={isStarred ? 'Remove from starred' : 'Add to starred'}
    >
      {isStarred && isSelected ? (
        <DetailedHeart />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${baseSvgClasses} ${conditionalSvgClasses}`}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
}
