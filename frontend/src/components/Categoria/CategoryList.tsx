import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import type { CreateCategoryPayload } from '../../hooks/useCategories';
import type { Category } from '../../interfaces/Category';
import CategoryForm from './CategoryForm';
import styles from './CategoryList.module.css';

const CategoryList: React.FC = () => {
  const { categories, isLoading, error, addCategory, updateCategory, deleteCategory, isAdding, isUpdating } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = async (data: CreateCategoryPayload) => {
    try {
      await addCategory(data);
      alert('Categoría agregada con éxito!');
    } catch (err) {
      alert('Error al agregar categoría.');
    }
  };

  const handleUpdateCategory = async (data: CreateCategoryPayload) => {
    if (editingCategory) {
      try {
        await updateCategory({ ...editingCategory, ...data });
        alert('Categoría actualizada con éxito!');
        setEditingCategory(null); 
      } catch (err) {
        alert('Error al actualizar categoría.');
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await deleteCategory(id);
        alert('Categoría eliminada con éxito!');
      } catch (err) {
        alert('Error al eliminar categoría.');
      }
    }
  };

  if (isLoading) return <div className={styles.loading}>Cargando categorías...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <h2>Gestión de Categorías</h2>

      <div className={styles.formSection}>
        <h3>{editingCategory ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h3>
        <CategoryForm
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          initialData={editingCategory || undefined}
          isSubmitting={isAdding || isUpdating}
        />
        {editingCategory && (
          <button onClick={() => setEditingCategory(null)} className={styles.cancelButton}>
            Cancelar Edición
          </button>
        )}
      </div>

      <div className={styles.listSection}>
        <h3>Categorías Existentes</h3>
        {categories && categories.length === 0 ? (
          <p>No hay categorías creadas aún.</p>
        ) : (
          <ul className={styles.categoryList}>
            {categories?.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <span>{category.nombre}</span>
                <div className={styles.actions}>
                  <button onClick={() => setEditingCategory(category)} className={styles.editButton}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)} className={styles.deleteButton}>
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

export default CategoryList;
