import React from 'react';
import styles from './Header.module.css';
import useAuth from '../../hooks/useAuth';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { logout, user } = useAuth();

  return (
    <header className={styles.header}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            ☰
          </button>
      <div className={styles.logo}>
        <h1>Fracttal Tasks</h1>
      </div>
      <nav className={styles.nav}>
        {user && <span className={styles.userName}>Hola, {user.nombre}</span>}
        <button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </nav>
    </header>
  );
};

export default Header;
