import React from 'react';
import { useSnackbar } from '../../../context/snackbar/SnackbarContext';
import styles from './Snackbar.module.css';

const Snackbar: React.FC = () => {
  const { snackbar, setSnackbar } = useSnackbar();

  if (!snackbar.open) return null;

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className={`${styles.snackbar} ${styles[snackbar.type]}`}>
      <span>{snackbar.message}</span>
      <button onClick={handleClose} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );
};

export default Snackbar;
