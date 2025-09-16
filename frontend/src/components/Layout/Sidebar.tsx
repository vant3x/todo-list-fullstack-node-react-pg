import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { Tag, LayoutDashboard, ListTodo, PlusCircle } from 'lucide-react';
import Modal from '../shared/Modal/Modal';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';

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
  const { categories, refetch: refetchCategories, isLoading: isLoadingCategories, error: errorCategories } = useCategories(); 
  const { tags, refetch: refetchTags, isLoading: isLoadingTags, error: errorTags } = useTags(); 
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryFormSuccess = () => {
    setIsCategoryModalOpen(false);
    refetchCategories(); 
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              <ListTodo size={18} /> Categorías
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tags/manage" 
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              <Tag size={18} /> Gestionar Etiquetas
            </NavLink>
          </li>
        </ul>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <h3>Categorías</h3>
            <button onClick={() => setIsCategoryModalOpen(true)} className={styles.addCategoryButton}>
          
            </button>
          </div>
          {isLoadingCategories ? (
            <p className={styles.noItems}>Cargando categorías...</p>
          ) : errorCategories ? (
            <p className={styles.noItems}>Error al cargar categorías.</p>
          ) : (categories ?? []).length === 0 ? (
            <p className={styles.noItems}>No hay categorías.</p>
          ) : (
            <ul>
              {(categories ?? []).map((category) => (
                <li key={category.id}>
                  <NavLink
                    to={`/categories/${category.id}`}
                    className={({ isActive }) =>
                      isActive ? styles.activeLink : styles.link
                    }
                  >
                    <span
                      className={styles.colorDot}
                      style={{ backgroundColor: stringToColor(category.nombre) }}
                    ></span>
                    {category.nombre}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>
            <h3>Etiquetas</h3>
          </div>
          {isLoadingTags ? (
            <p className={styles.noItems}>Cargando etiquetas...</p>
          ) : errorTags ? (
            <p className={styles.noItems}>Error al cargar etiquetas.</p>
          ) : (tags ?? []).length === 0 ? (
            <p className={styles.noItems}>No hay etiquetas.</p>
          ) : (
            <ul>
              {(tags ?? []).map((tag) => (
                <li key={tag.id}>
                  <NavLink
                    to={`/tags/${tag.id}`}
                    className={({ isActive }) =>
                      isActive ? styles.activeLink : styles.link
                    }
                  >
                    <Tag size={18} /> {tag.nombre}
                  </NavLink>
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
