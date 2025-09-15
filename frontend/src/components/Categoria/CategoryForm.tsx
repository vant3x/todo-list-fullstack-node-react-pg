import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './CategoryForm.module.css';

const categorySchema = z.object({
  nombre: z.string().min(1, "El nombre de la categoría es requerido"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => void;
  initialData?: CategoryFormValues;
  isSubmitting?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      nombre: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
    if (!initialData) { 
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="nombre">Nombre de la Categoría:</label>
        <input
          type="text"
          id="nombre"
          {...register('nombre')}
          className={errors.nombre ? styles.inputError : ''}
          disabled={isSubmitting}
        />
        {errors.nombre && <p className={styles.errorMessage}>{errors.nombre.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
      </button>
    </form>
  );
};

export default CategoryForm;
