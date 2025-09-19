import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { Tag, LayoutDashboard, ListTodo, Folder, Tags, ListChecks } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useFilters } from '../../context/filters/FilterContext';

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const Sidebar: React.FC = () => {
  const { categories, isLoading: isLoadingCategories, error: errorCategories } = useCategories(); 
  const { tags, isLoading: isLoadingTags, error: errorTags } = useTags(); 
  const { filters, setCategoryFilter, toggleTagFilter } = useFilters();

  return (
    <aside className={styles.sidebar}>
      {/* Título de la Aplicación */}
      <div className={styles.appTitle}>
        <ListChecks size={24} />
        <h1>Fracttal Tasks</h1>
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              <ListTodo size={18} /> Categorías
            </NavLink>
          </li>
          <li>
            <NavLink to="/tags/manage" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
              <Tag size={18} /> Gestionar Etiquetas
            </NavLink>
          </li>
        </ul>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <h3><Folder size={14}/> Categorías</h3>
          </div>
          {isLoadingCategories ? <p className={styles.noItems}>Cargando...</p> : errorCategories ? <p className={styles.noItems}>Error.</p> : (
            <ul>
              <li>
                <button 
                  onClick={() => setCategoryFilter(undefined)}
                  className={`${styles.link} ${!filters.categoria ? styles.activeLink : ''}`}>
                  Todas
                </button>
              </li>
              {(categories ?? []).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => category.nombre === 'General' ? setCategoryFilter('general') : setCategoryFilter(category.id)}
                    className={`${styles.link} ${filters.categoria === (category.nombre === 'General' ? 'general' : category.id) ? styles.activeLink : ''}`}>
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: stringToColor(category.nombre) }}
                    ></span>
                    {category.nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <h3><Tags size={14}/> Etiquetas</h3>
          </div>
          {isLoadingTags ? <p className={styles.noItems}>Cargando...</p> : errorTags ? <p className={styles.noItems}>Error.</p> : (
            <ul>
              {(tags ?? []).map((tag) => (
                <li key={tag.id}>
                  <button 
                    key={tag.id} 
                    onClick={() => toggleTagFilter(tag.nombre)}
                    className={`${styles.link} ${(filters.etiquetas || []).includes(tag.nombre) ? styles.activeLink : ''}`}>
                     <Tag size={14} /> {tag.nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
