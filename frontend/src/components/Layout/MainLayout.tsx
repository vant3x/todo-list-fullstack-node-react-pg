import React, { useState } from 'react';
import styles from './MainLayout.module.css';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <Header toggleSidebar={toggleSidebar} />
      <div className={styles.contentArea}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
