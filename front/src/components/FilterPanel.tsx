import { useState, useEffect } from 'react';
import FilterButton from './FilterButton';
import BackIcon from '../assets/icons/BackIcon.svg?react';
import { ActiveFilters, SortOrder } from '../types';
import { FilterPanelProps } from '../types';
import useMediaQuery from '../hooks/useMediaQuery';

export default function FilterPanel({
  currentFilters,
  currentSortOrder,
  onApplyFilters,
  onClose,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] =
    useState<ActiveFilters>(currentFilters);
    const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(currentSortOrder);

  const isMobile = useMediaQuery('(max-width: 1279px)');

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterSelect = (
    filterKey: keyof ActiveFilters,
    value: string | undefined
  ) => {
    setLocalFilters((prevFilters: ActiveFilters) => {
      const newFilters = { ...prevFilters };
      if (value) {
        newFilters[filterKey] = value;
      } else {
        delete newFilters[filterKey];
      }
      return newFilters;
    });
  };

  const handleSortSelect = (sortValue: SortOrder) => {
    setLocalSortOrder(sortValue);
};

  const handleApplyClick = () => {
    onApplyFilters(localFilters, localSortOrder);
  };

  return (
    <div
      className={`
            fixed inset-0 bg-white z-30 p-4 flex flex-col
            xl:absolute xl:inset-auto xl:inset-x-0 xl:top-full xl:mt-1 xl:left-0 xl:right-auto 
            xl:min-w-[300px] xl:w-full
            xl:border xl:border-gray-300 xl:rounded-lg xl:shadow-lg xl:z-20 
            xl:p-4 xl:block xl:overflow-visible
        `}
    >
      {isMobile && (
        <div className="flex justify-between items-center pb-3 mb-4 flex-shrink-0">
          <button onClick={onClose} className="py-2">
            <BackIcon />
          </button>
          <h3 className="text-md font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="opacity-0 pointer-events-none p-1 -ml-1 mr-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        </div>
      )}

      <div className={isMobile ? 'flex-grow overflow-y-auto mb-4' : 'mb-4'}>
        {' '}
        <div className="mb-5">
          <label className="block text-sm font-medium text-light-text mb-2">
            Status
          </label>
          <div className="flex justify-start flex-wrap gap-2">
            <FilterButton
              label="All"
              value={undefined}
              currentSelection={localFilters.status}
              onClick={(val) => handleFilterSelect('status', val)}
            />
            <FilterButton
              label="Alive"
              value="Alive"
              currentSelection={localFilters.status}
              onClick={(val) => handleFilterSelect('status', val)}
            />
            <FilterButton
              label="Dead"
              value="Dead"
              currentSelection={localFilters.status}
              onClick={(val) => handleFilterSelect('status', val)}
            />
            <FilterButton
              label="Unknown"
              value="unknown"
              currentSelection={localFilters.status}
              onClick={(val) => handleFilterSelect('status', val)}
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-light-text mb-2">
            Specie
          </label>
          <div className="flex justify-between gap-2">
            <FilterButton
              label="All"
              value={undefined}
              currentSelection={localFilters.species}
              onClick={(val) => handleFilterSelect('species', val)}
            />
            <FilterButton
              label="Human"
              value="Human"
              currentSelection={localFilters.species}
              onClick={(val) => handleFilterSelect('species', val)}
            />
            <FilterButton
              label="Alien"
              value="Alien"
              currentSelection={localFilters.species}
              onClick={(val) => handleFilterSelect('species', val)}
            />
          </div>
        </div>
        <div className="mb-5">
                <label className="block text-sm font-medium text-gray-600 mb-2">Sort by Name</label>
                <div className="flex flex-wrap gap-2">
                    {/* Botón Default (Sin Ordenación) */}
                    <FilterButton
                        label="Default (ID)"
                        value={undefined} // Representamos 'sin orden' con undefined para FilterButton
                        currentSelection={localSortOrder ?? undefined} // Convierte null a undefined para la prop
                        onClick={() => handleSortSelect(null)} // Al hacer clic, llama a handleSortSelect con null
                    />
                    {/* Botón A-Z */}
                    <FilterButton
                        label="A-Z"
                        value={'ASC'} // El valor 'ASC' es un string, compatible
                        currentSelection={localSortOrder ?? undefined} // Convierte null a undefined
                        onClick={() => handleSortSelect('ASC')} // Al hacer clic, llama a handleSortSelect con 'ASC'
                    />
                    {/* Botón Z-A */}
                    <FilterButton
                        label="Z-A"
                        value={'DESC'} // El valor 'DESC' es un string, compatible
                        currentSelection={localSortOrder ?? undefined} // Convierte null a undefined
                        onClick={() => handleSortSelect('DESC')} // Al hacer clic, llama a handleSortSelect con 'DESC'
                    />
                </div>
            </div>
      </div>
      
      <div className="flex-shrink-0">
        <button
          onClick={handleApplyClick}
          className="w-full bg-primary-600 hover:bg-[#5A3696] text-white font-medium py-3 px-4 rounded-lg border "
        >
          Filter
        </button>
      </div>
    </div>
  );
}
