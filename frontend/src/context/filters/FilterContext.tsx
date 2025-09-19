import React, { createContext, useState, useContext, useMemo } from 'react';
import type { TaskFilters } from '../../types';

interface FilterContextType {
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  setCategoryFilter: (categoryId?: string) => void;
  toggleTagFilter: (tagName: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<TaskFilters>({});

  const setCategoryFilter = (categoryId?: string) => {
    setFilters(prevFilters => ({ ...prevFilters, categoria: categoryId, etiquetas: prevFilters.etiquetas }));
  };

  const toggleTagFilter = (tagName: string) => {
    setFilters(prevFilters => {
      const currentTags = prevFilters.etiquetas || [];
      const newTags = currentTags.includes(tagName)
        ? currentTags.filter(t => t !== tagName)
        : [...currentTags, tagName];
      return { ...prevFilters, etiquetas: newTags.length > 0 ? newTags : undefined };
    });
  };

  const value = useMemo(() => ({
    filters,
    setFilters,
    setCategoryFilter,
    toggleTagFilter,
  }), [filters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
