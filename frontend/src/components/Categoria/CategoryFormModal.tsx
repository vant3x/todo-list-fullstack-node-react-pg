import React, { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import * as Types from '../../types';
import styles from './CategoryForm.module.css';

interface CategoryFormModalProps {
  initialData?: Types.Category;
  onSuccess?: () => void;
  onClose: () => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ initialData, onSuccess, onClose }) => {
  const { createCategory, updateCategory } = useCategories();

  const [name, setName] = useState(initialData?.nombre || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.nombre);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      nombre: name,
    };

    try {
      if (initialData) {
        await updateCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="categoryName">Nombre de la Categoría</label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
      </div>
    </form>
  );
};

export default CategoryFormModal;
