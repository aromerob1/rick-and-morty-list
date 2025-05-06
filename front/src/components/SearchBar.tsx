import { useEffect, useState } from 'react';
import FiltersIcon from '../assets/icons/FiltersIcon.svg?react';
import SearchIcon from '../assets/icons/SearchIcon.svg?react';
import useDebounce from '../hooks/useDebounce';
import ActiveFiltersIcon from '../assets/icons/ActiveFiltersIcon.svg?react';
import { SearchBarProps } from '../types';

export default function SearchBar({
  onToggleFilters,
  onSearchChange,
  isPanelOpen = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    console.log(
      `[SearchBar] Debounced term: "${debouncedSearchTerm}".`
    );
    onSearchChange({ name: debouncedSearchTerm.trim() || undefined });
  }, [debouncedSearchTerm, onSearchChange]);
  return (
    <div className="flex items-center mb-4 relative">
      <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search or filter results"
        className="bg-searchbar text-sm rounded-lg py-2 px-10 w-full font-medium focus:outline-none xl:py-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="button"
        onClick={onToggleFilters}
        className={`absolute right-3.5 top-1/2 transform -translate-y-1/2 focus:outline-none ${isPanelOpen ? 'bg-primary-100' : ''} rounded-lg p-2`}
        aria-label="Toggle filters"
      >
        {isPanelOpen ? (
          <ActiveFiltersIcon className="w-4 h-4 cursor-pointer" />
        ) : (
          <FiltersIcon className="w-4 h-4 cursor-pointer" />
        )}
      </button>
    </div>
  );
}
