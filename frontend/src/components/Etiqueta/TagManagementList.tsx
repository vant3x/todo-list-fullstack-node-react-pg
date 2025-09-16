import React, { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import * as Types from '../../types';
import styles from './TagManagementList.module.css';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Modal from '../shared/Modal/Modal';
import TagFormModal from './TagFormModal';
import DeleteConfirmationModal from '../shared/Modal/DeleteConfirmationModal';

const TagManagementList: React.FC = () => {
  const { tags, isLoading, error, deleteTag, refetch } = useTags();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    setCurrentTag(tag);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setCurrentTag(undefined);
    refetch();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentTag(undefined);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
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
        <h2>Gestión de Etiquetas</h2>
        <button onClick={() => setIsAddModalOpen(true)} className={styles.addButton}>
          <Plus size={18} /> Agregar Etiqueta
        </button>
      </div>
      {tags.length === 0 ? (
        <p>No hay etiquetas creadas aún.</p>
      ) : (
        <ul className={styles.tagList}>
          {tags.map((tag) => (
            <li key={tag.id} className={styles.tagItem}>
              <div className={styles.tagInfo}>
                <span>{tag.nombre}</span>
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
      )}

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title="Editar Etiqueta">
        {currentTag && (
          <TagFormModal
            initialData={currentTag}
            onClose={handleCloseEditModal}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal} title="Agregar Nueva Etiqueta">
        <TagFormModal
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
        />
      </Modal>

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
