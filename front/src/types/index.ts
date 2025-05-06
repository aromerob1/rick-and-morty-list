export interface CharacterItemProps {
    character: Character;
    onSelect: (id: string | number) => void;
    isSelected: boolean;
  }

export interface CharacterDetailViewProps {
    characterId: string | number | null;
  }

export interface FilterButtonProps {
    label: string;
    value: string | undefined;
    currentSelection: string | undefined;
    onClick: (value: string | undefined) => void;
  }

export interface ActiveFilters {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    originName?: string;
  }
  
export interface FilterPanelProps {
    currentFilters: ActiveFilters;
    onApplyFilters: (newFilters: ActiveFilters) => void;
    onClose: () => void;
  }

  export interface LikeHeartProps {
    isStarred: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    isSelected?: boolean;
  }

  export interface SearchBarProps {
    onToggleFilters: () => void;
    onSearchChange: (filters: { name?: string }) => void;
    isPanelOpen?: boolean;
  }

export interface ActiveFilters {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    originName?: string;
}

export interface Character {
    id: string | number;
    name: string;
    status: string;
    species: string;
    type: string; 
    image: string;
    starred: boolean;
    gender?: string; 
    originName?: string | null;
    locationName?: string | null;
    createdAt?: string;
    updatedAt?: string;
}