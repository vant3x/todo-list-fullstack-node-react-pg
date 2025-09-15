import React from 'react';
import styles from './MainLayout.module.css';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentArea}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.mainContentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
