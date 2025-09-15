import React, { useState } from 'react';
import { useTags} from '../../hooks/useTags';
import type { CreateTagPayload, Tag } from '../../hooks/useTags';
import TagForm from './TagForm';
import styles from './TagList.module.css';

const TagList: React.FC = () => {
  const { tags, isLoading, error, addTag, updateTag, deleteTag, isAdding, isUpdating, isDeleting } = useTags();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddTag = async (data: CreateTagPayload) => {
    try {
      await addTag(data);
      alert('Etiqueta agregada con éxito!');
    } catch (err) {
      alert('Error al agregar etiqueta.');
    }
  };

  const handleUpdateTag = async (data: CreateTagPayload) => {
    if (editingTag) {
      try {
        await updateTag({ ...editingTag, ...data });
        alert('Etiqueta actualizada con éxito!');
        setEditingTag(null); // Exit editing mode
      } catch (err) {
        alert('Error al actualizar etiqueta.');
      }
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      try {
        await deleteTag(id);
        alert('Etiqueta eliminada con éxito!');
      } catch (err) {
        alert('Error al eliminar etiqueta.');
      }
    }
  };

  if (isLoading) return <div className={styles.loading}>Cargando etiquetas...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <h2>Gestión de Etiquetas</h2>

      <div className={styles.formSection}>
        <h3>{editingTag ? 'Editar Etiqueta' : 'Agregar Nueva Etiqueta'}</h3>
        <TagForm
          onSubmit={editingTag ? handleUpdateTag : handleAddTag}
          initialData={editingTag || undefined}
          isSubmitting={isAdding || isUpdating}
        />
        {editingTag && (
          <button onClick={() => setEditingTag(null)} className={styles.cancelButton}>
            Cancelar Edición
          </button>
        )}
      </div>

      <div className={styles.listSection}>
        <h3>Etiquetas Existentes</h3>
        {tags && tags.length === 0 ? (
          <p>No hay etiquetas creadas aún.</p>
        ) : (
          <ul className={styles.tagList}>
            {tags?.map((tag) => (
              <li key={tag.id} className={styles.tagItem}>
                <span>{tag.nombre}</span>
                <div className={styles.actions}>
                  <button onClick={() => setEditingTag(tag)} className={styles.editButton}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteTag(tag.id)} className={styles.deleteButton}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagList;
