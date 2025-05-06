import { FilterButtonProps } from "../types";

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  value,
  currentSelection,
  onClick,
}) => {
  const isActive = currentSelection === value;
  const baseClasses =
    'py-2.5 cursor-pointer px-5 text-center rounded-lg text-sm font-medium transition duration-150 ease-in-out';
  const activeClasses = 'bg-primary-100 text-primary-600';
  const inactiveClasses =
    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 border border-[#E5E7EB]';

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`grow ${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export default FilterButton;
