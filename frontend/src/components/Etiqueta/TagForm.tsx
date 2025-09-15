import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './TagForm.module.css';

const tagSchema = z.object({
  nombre: z.string().min(1, "El nombre de la etiqueta es requerido"),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagFormProps {
  onSubmit: (data: TagFormValues) => void;
  initialData?: TagFormValues;
  isSubmitting?: boolean;
}

const TagForm: React.FC<TagFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: initialData || {
      nombre: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: TagFormValues) => {
    onSubmit(data);
    if (!initialData) { 
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="nombre">Nombre de la Etiqueta:</label>
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
        {isSubmitting ? 'Guardando...' : 'Guardar Etiqueta'}
      </button>
    </form>
  );
};

export default TagForm;
