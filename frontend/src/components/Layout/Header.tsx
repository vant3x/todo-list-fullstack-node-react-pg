import React from 'react';
import styles from './Header.module.css';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Fracttal Tasks</h1>
      </div>
      <nav className={styles.nav}>
        {user && <span className={styles.userName}>Hola, {user.nombre}</span>}
        <button onClick={toggleTheme} className={styles.themeToggleButton}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
};

export default Header;
