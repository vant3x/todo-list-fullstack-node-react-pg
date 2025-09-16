import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import * as Types from '../../types';
import styles from './CategoryManagementList.module.css';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';
import DeleteConfirmationModal from '../shared/Modal/DeleteConfirmationModal';

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const CategoryListManager: React.FC = () => {
  const { categories, loading, error, deleteCategory, fetchCategories, addCategory, updateCategory, isAdding, isUpdating } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Types.Category | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Types.Category | undefined>(undefined);

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        fetchCategories();
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } catch (err: any) {
        console.error('Error deleting category:', err);
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleEdit = (category: Types.Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: { nombre: string }) => {
    try {
      if (editingCategory) {
        await updateCategory({ ...editingCategory, nombre: data.nombre });
      } else {
        await addCategory(data);
      }
      setShowForm(false);
      setEditingCategory(undefined);
      fetchCategories(); 
    } catch (err) {
      console.error('Erroral guardar categoria', err);
    
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  if (loading) {
    return <p>Cargando categorías...</p>;
  }

  if (error) {
    return <p>Error al cargar categorías: {error}</p>;
  }

  return (
    <div className={styles.categoryListContainer}>
      <div className={styles.headerContainer}>
        <h2>Gestión de Categorías</h2>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditingCategory(undefined); }} className={styles.addButton}>
            <Plus size={18} /> Agregar Categoría
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h3>
          <CategoryForm
            initialData={editingCategory ? { nombre: editingCategory.nombre } : undefined}
            onSubmit={handleFormSubmit}
            isSubmitting={isAdding || isUpdating}
          />
          <button onClick={handleCancelForm} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      )}

      {!showForm && (
        categories?.length === 0 ? (
          <p>No hay categorías creadas aún.</p>
        ) : (
          <ul className={styles.categoryList}>
            {categories?.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: stringToColor(category.nombre) }}
                  ></span>
                  <span>{category.nombre}</span>
                </div>
                <div className={styles.categoryActions}>
                  {category.id !== 'default-general-category' && (
                    <>
                      <button onClick={() => handleEdit(category)} className={styles.editButton}>
                        <Pencil size={16} /> Editar
                      </button>
                      <button onClick={() => handleDeleteClick(category.id)} className={styles.deleteButton}>
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </>
                  )}
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
        message={`¿Estás seguro de que quieres eliminar la categoría "${categories?.find(categorie => categorie.id === categoryToDelete)?.nombre || ''}"? Se eliminarán todas las tareas asociadas.`}
      />
    </div>
  );
};

export default CategoryListManager;
