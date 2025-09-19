import React, { useState, useEffect } from 'react';
import { useFilters } from '../../context/filters/FilterContext';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './TaskFilter.module.css';
import { Search, X } from 'lucide-react';
import { Priority } from '../../types';

const priorityMap: { [key in Priority]: string } = {
  [Priority.ALTA]: 'Alta',
  [Priority.MEDIA]: 'Media',
  [Priority.BAJA]: 'Baja',
};

const sortOptions = {
  creado_en: 'Fecha de Creación',
  fecha_vencimiento: 'Fecha de Vencimiento',
  prioridad: 'Prioridad',
  titulo: 'Título',
};

const TaskFilter: React.FC = () => {
  const { filters, setFilters } = useFilters();
  
  const [searchTerm, setSearchTerm] = useState(filters.busqueda || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters(prev => ({ ...prev, busqueda: debouncedSearchTerm }));
  }, [debouncedSearchTerm, setFilters]);

  useEffect(() => {
    if (filters.busqueda !== searchTerm) {
      setSearchTerm(filters.busqueda || '');
    }
  }, [filters.busqueda]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === '' ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : value !== '')
  );

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.statusFilter}>
        <button 
          className={filters.completada === undefined ? styles.activeStatus : ''}
          onClick={() => handleFilterChange('completada', undefined)}>
            Todas
        </button>
        <button 
          className={filters.completada === false ? styles.activeStatus : ''}
          onClick={() => handleFilterChange('completada', false)}>
            Pendientes
        </button>
        <button 
          className={filters.completada === true ? styles.activeStatus : ''}
          onClick={() => handleFilterChange('completada', true)}>
            Completadas
        </button>
      </div>

      <select 
        className={styles.selectFilter}
        value={filters.prioridad || ''}
        onChange={(e) => handleFilterChange('prioridad', e.target.value)}
      >
        <option value="">Prioridad</option>
        {Object.values(Priority).map(p => (
          <option key={p} value={p}>{priorityMap[p]}</option>
        ))}
      </select>

      <select 
        className={styles.selectFilter}
        value={filters.ordenar || 'creado_en'}
        onChange={(e) => handleFilterChange('ordenar', e.target.value)}
      >
        <option disabled>Ordenar por</option>
        {Object.entries(sortOptions).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>

      <select 
        className={styles.selectFilter}
        value={filters.direccion || 'desc'}
        onChange={(e) => handleFilterChange('direccion', e.target.value)}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      
      {hasActiveFilters && (
        <button onClick={clearFilters} className={styles.clearButton}>
          <X size={16} />
          Limpiar
        </button>
      )}
    </div>
  );
};

export default TaskFilter;
