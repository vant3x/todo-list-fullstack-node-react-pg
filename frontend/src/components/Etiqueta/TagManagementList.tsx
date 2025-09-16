import React, { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import * as Types from '../../types';
import styles from './TagManagementList.module.css';
import { Pencil, Trash2, Plus, Tag } from 'lucide-react';
import TagForm from './TagForm';
import DeleteConfirmationModal from '../shared/Modal/DeleteConfirmationModal';

const TagManagementList: React.FC = () => {
  const { tags, isLoading, error, deleteTag, refetch, addTag, updateTag, isAdding, isUpdating } = useTags();
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Types.Tag | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState<Types.Tag | undefined>(undefined);

  const handleDeleteClick = (id: string) => {
    setTagToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      try {
        await deleteTag(tagToDelete);
        refetch();
        setShowDeleteModal(false);
        setTagToDelete(null);
      } catch (err: any) {
        console.error('Error deleting tag:', err);
        setShowDeleteModal(false);
        setTagToDelete(null);
      }
    }
  };

  const handleEdit = (tag: Types.Tag) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: { nombre: string }) => {
    try {
      if (editingTag) {
        await updateTag({ ...editingTag, nombre: data.nombre });
      } else {
        await addTag(data);
      }
      setShowForm(false);
      setEditingTag(undefined);
      refetch();
    } catch (err) {
      console.error('Error saving tag:', err);
     
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTag(undefined);
  };

  if (isLoading) {
    return <p>Cargando etiquetas...</p>;
  }

  if (error) {
    return <p>Error al cargar etiquetas: {error.message}</p>;
  }

  return (
    <div className={styles.tagListContainer}>
      <div className={styles.headerContainer}>
        <h2>  Gestión de Etiquetas</h2>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditingTag(undefined); }} className={styles.addButton}>
            <Plus size={18} /> Agregar Etiqueta
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editingTag ? 'Editar Etiqueta' : 'Agregar Nueva Etiqueta'}</h3>
          <TagForm
            initialData={editingTag ? { nombre: editingTag.nombre } : undefined}
            onSubmit={handleFormSubmit}
            isSubmitting={isAdding || isUpdating}
          />
          <button onClick={handleCancelForm} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      )}

      {!showForm && (
        tags?.length === 0 ? (
          <p>No hay etiquetas creadas aún.</p>
        ) : (
          <ul className={styles.tagList}>
            {tags.map((tag) => (
              <li key={tag.id} className={styles.tagItem}>
                <div className={styles.tagInfo}>
                <Tag size={18} />  <span>{tag.nombre}</span>
                </div>
                <div className={styles.tagActions}>
                  <button onClick={() => handleEdit(tag)} className={styles.editButton}>
                    <Pencil size={16} /> Editar
                  </button>
                  <button onClick={() => handleDeleteClick(tag.id)} className={styles.deleteButton}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Estás seguro de que quieres eliminar la etiqueta "${tags.find(t => t.id === tagToDelete)?.nombre || ''}"? Se eliminarán de todas las tareas asociadas.`}
      />
    </div>
  );
};

export default TagManagementList;
