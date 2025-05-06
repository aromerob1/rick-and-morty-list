import { useCallback, useState } from 'react';
import CharacterItem from '../components/CharacterItem';
import SearchBar from '../components/SearchBar';
import { useQuery } from '@apollo/client';
import CharacterDetailView from '../components/CharacterDetailView';
import FilterPanel from '../components/FilterPanel';
import BackIcon from '../assets/icons/BackIcon.svg?react';
import { GET_CHARACTERS_QUERY } from '../graphql/queries';
import { Character, ActiveFilters, SortOrder } from '../types';

export default function CharacterPage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const [selectedCharacterId, setSelectedCharacterId] = useState<
    string | number | null
  >(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | null>(null);

  console.log(
    'CharacterPage: Estado INICIAL activeFilters',
    JSON.stringify(activeFilters)
  );

  const toggleFilterPanel = useCallback(() => {
    setIsFilterPanelOpen((prev) => !prev);
  }, []);

  const handleApplyFilters = useCallback(
    (newFilters: ActiveFilters, newSortOrder: SortOrder) => {
      console.log(
        'CharacterPage: Aplicando filtros desde Panel ->',
        newFilters
      );
      setActiveFilters(newFilters);
      setSortOrder(newSortOrder);
      setIsFilterPanelOpen(false);
    },
    []
  );

  const handleNameChange = useCallback((nameFilterValue: { name?: string }) => {
    console.log('CharacterPage: Recibido cambio de nombre ->', nameFilterValue);
    setActiveFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const newName = nameFilterValue.name;
      if (newName && newName.trim() !== '') {
        updatedFilters.name = newName.trim();
      } else {
        delete updatedFilters.name;
      }
      if (JSON.stringify(prevFilters) === JSON.stringify(updatedFilters)) {
        return prevFilters;
      }
      console.log(
        'CharacterPage: Actualizando activeFilters a ->',
        updatedFilters
      );
      return updatedFilters;
    });
  }, []);

  const handleSelectCharacter = useCallback((id: string | number | null) => {
    console.log('CharacterPage: Seleccionando ID ->', id);
    setSelectedCharacterId(id);
  }, []);

  console.log(
    'CharacterPage: Estado activo de filtros',
    JSON.stringify(activeFilters)
  );
  const { data: dataNoStarred } = useQuery(GET_CHARACTERS_QUERY, {
    variables: {
      filter: {
        starred: false,
        ...activeFilters,
      },
      sortByName: sortOrder || undefined,
    },
  });

  const { data: dataStarred } = useQuery(GET_CHARACTERS_QUERY, {
    variables: {
      filter: {
        starred: true,
        ...activeFilters,
      },
      sortByName: sortOrder || undefined,
    },
  });

  const starredCharacters = dataStarred?.characters || [];
  const noStarredCharacters = dataNoStarred?.characters || [];

  const totalResults = starredCharacters.length + noStarredCharacters.length;
  const filterCount = Object.keys(activeFilters).length;

  return (
    <div className="xl:flex xl:overflow-y-hidden xl:h-screen">
      <div className="px-6 xl:w-[30%] relative overflow-y-auto scrollbar-hidden">
        {filterCount === 0 ? (
          <>
            <h1 className="font-bold text-2xl pt-[2.625rem] pb-[1.125rem]">
              Rick and Morty list
            </h1>
            <div className="relative mb-4">
              {' '}
              <SearchBar
                onToggleFilters={toggleFilterPanel}
                onSearchChange={handleNameChange}
                isPanelOpen={isFilterPanelOpen}
              />
              {isFilterPanelOpen && (
                <FilterPanel
                  currentFilters={activeFilters}
                  currentSortOrder={sortOrder}
                  onApplyFilters={handleApplyFilters}
                  onClose={toggleFilterPanel}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="flex items-center justify-between py-4 xl:hidden">
              <div className="py-2">
                <BackIcon onClick={() => setActiveFilters({})} />
              </div>
              <h1 className="font-semibold">Advanced search</h1>
              <button
                className="text-primary-600 font-semibold"
                onClick={() => setActiveFilters({})}
              >
                Done
              </button>
            </nav>
            <div className="hidden xl:block">
              <h1 className="font-bold text-2xl pt-[2.625rem] pb-[1.125rem]">
                Rick and Morty list
              </h1>
              <div className="relative mb-4">
                {' '}
                <SearchBar
                  onToggleFilters={toggleFilterPanel}
                  onSearchChange={handleNameChange}
                  isPanelOpen={isFilterPanelOpen}
                />
                {isFilterPanelOpen && (
                  <FilterPanel
                    currentFilters={activeFilters}
                    currentSortOrder={sortOrder}
                    onApplyFilters={handleApplyFilters}
                    onClose={toggleFilterPanel}
                  />
                )}
              </div>
            </div>
          </>
        )}
        {filterCount > 0 && (
          <div className="flex justify-between items-center py-4 text-sm border-b border-t border-gray-200 xl:border-none xl:px-3 xl:py-4 xl:mb-0">
            <span className="font-semibold text-[#2563EB]">
              {totalResults} Result{totalResults !== 1 ? 's' : ''}{' '}
            </span>

            <span className="bg-green-100 text-green-800 px-3 py-0.5 rounded-full text-xs font-medium">
              {filterCount} Filter{filterCount > 1 ? 's' : ''}{' '}
            </span>
          </div>
        )}
        <section>
          <h2 className="text-xs text-light-text font-semibold py-4">
            STARRED CHARACTERS ({starredCharacters.length})
          </h2>
          <ul>
            {starredCharacters.length > 0 ? (
              starredCharacters.map((char: Character) => (
                <li key={char.id} className="border-cool-gray-200 border-t">
                  <CharacterItem
                    character={char}
                    onSelect={handleSelectCharacter}
                    isSelected={selectedCharacterId === char.id}
                  />
                </li>
              ))
            ) : (
              <p>No characters found</p>
            )}
          </ul>
        </section>
        <section>
          <h2 className="text-xs text-light-text font-semibold py-4">
            CHARACTERS ({noStarredCharacters.length})
          </h2>
          <ul>
              {noStarredCharacters.length > 0 ? (
                noStarredCharacters.map((char: Character) => (
                  <li key={char.id} className="border-cool-gray-200 border-t">
                    <CharacterItem
                      character={char}
                      onSelect={handleSelectCharacter}
                      isSelected={selectedCharacterId === char.id}
                    />
                  </li>
                ))
              ) : (
                <p>No characters found</p>
              )}
          </ul>
        </section>
      </div>
      <div className="hidden xl:block xl:flex-1 xl:h-full xl:shadow-[0px_4px_60px_0px_rgba(0,0,0,0.05)] xl:overflow-y-auto">
        <CharacterDetailView characterId={selectedCharacterId} />
      </div>
    </div>
  );
}
