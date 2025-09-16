import React from 'react';
import Modal from './Modal';
import styles from './DeleteConfirmationModal.module.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = 'Confirmar Eliminación',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.content}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
