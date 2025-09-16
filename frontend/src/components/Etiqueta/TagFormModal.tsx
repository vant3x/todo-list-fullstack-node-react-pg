import React, { useState, useEffect } from 'react';
import { useTags } from '../../hooks/useTags';
import * as Types from '../../types';
import styles from './TagForm.module.css'; // Assuming you have a TagForm.module.css

interface TagFormModalProps {
  initialData?: Types.Tag;
  onSuccess?: () => void;
  onClose: () => void;
}

const TagFormModal: React.FC<TagFormModalProps> = ({ initialData, onSuccess, onClose }) => {
  const { addTag, updateTag } = useTags();

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
        await updateTag({ ...initialData, ...payload });
      } else {
        await addTag(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la etiqueta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="tagName">Nombre de la Etiqueta</label>
        <input
          type="text"
          id="tagName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Etiqueta' : 'Crear Etiqueta'}
        </button>
      </div>
    </form>
  );
};

export default TagFormModal;
