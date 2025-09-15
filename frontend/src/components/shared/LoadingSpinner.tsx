import React from 'react';
import styles from './LoadingSpinner.module.css'; 
const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loaderContainer}> 
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingSpinner;
