import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../../hooks/useApp';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import * as Types from '../../types';
import styles from './TaskForm.module.css';
import { useSnackbar } from '../../context/snackbar/SnackbarContext';

const priorityMap: { [key in Types.Priority]: string } = {
  [Types.Priority.BAJA]: 'Baja',
  [Types.Priority.MEDIA]: 'Media',
  [Types.Priority.ALTA]: 'Alta',
};

const taskSchema = z.object({
  titulo: z.string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  descripcion: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal('')),
  fecha_vencimiento: z.string().optional().refine(val => {
    if (!val) return true; // Allow empty value
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare dates only
    return new Date(val) >= today;
  }, {
    message: "La fecha de vencimiento no puede ser en el pasado",
  }),
  prioridad: z.nativeEnum(Types.Priority).default(Types.Priority.MEDIA),
  categoria_id: z.string().optional(),
  tagNames: z.array(z.string()).optional(),
});

type TaskFormSchema = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  initialData?: Types.Task;
  onSuccess?: () => void;
  onClose: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ initialData, onSuccess, onClose }) => {
  const { createTask, updateTask } = useApp();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      titulo: initialData?.titulo || '',
      descripcion: initialData?.descripcion || '',
      prioridad: initialData?.prioridad || Types.Priority.MEDIA,
      fecha_vencimiento: initialData?.fecha_vencimiento ? initialData.fecha_vencimiento.split('T')[0] : '',
      categoria_id: initialData?.categoria_id || '',
      tagNames: initialData?.etiquetas?.map(tag => tag.nombre) || [],
    },
  });

  const selectedTagNames = watch('tagNames', []);

  useEffect(() => {
    if (initialData) {
      reset({
        titulo: initialData.titulo,
        descripcion: initialData.descripcion || '',
        prioridad: initialData.prioridad,
        fecha_vencimiento: initialData.fecha_vencimiento ? initialData.fecha_vencimiento.split('T')[0] : '',
        categoria_id: initialData.categoria_id || '',
        tagNames: initialData.etiquetas?.map(tag => tag.nombre) || [],
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: TaskFormSchema) => {
    const payload: Types.CreateTaskPayload | Types.UpdateTaskPayload = {
      ...data,
      descripcion: data.descripcion || undefined,
      fecha_vencimiento: data.fecha_vencimiento ? new Date(data.fecha_vencimiento).toISOString() : undefined,
      categoria_id: data.categoria_id || null,
      tagNames: data.tagNames && data.tagNames.length > 0 ? data.tagNames : undefined,
    };

    try {
      if (initialData) {
        await updateTask(initialData.id, payload as Types.UpdateTaskPayload);
        showSnackbar('Tarea actualizada con éxito!', 'success');
      } else {
        await createTask(payload as Types.CreateTaskPayload);
        showSnackbar('Tarea creada con éxito!', 'success');
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      showSnackbar(err.message || 'Error al guardar la tarea', 'error');
    }
  };

  const handleTagChange = (tagName: string) => {
    const currentTags = selectedTagNames || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(nombre => nombre !== tagName)
      : [...currentTags, tagName];
    setValue('tagNames', newTags, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
      {errors.root?.message && <div className={styles.error}>{errors.root.message}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="titulo">Título</label>
        <input
          type="text"
          id="titulo"
          {...register('titulo')}
          disabled={isSubmitting}
          className={errors.titulo ? styles.inputError : ''}
        />
        {errors.titulo && <p className={styles.errorMessage}>{errors.titulo.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          {...register('descripcion')}
          rows={3}
          disabled={isSubmitting}
          className={errors.descripcion ? styles.inputError : ''}
        ></textarea>
        {errors.descripcion && <p className={styles.errorMessage}>{errors.descripcion.message}</p>}
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            {...register('prioridad')}
            disabled={isSubmitting}
            className={errors.prioridad ? styles.inputError : ''}
          >
            {Object.values(Types.Priority).map((p) => (
              <option key={p} value={p}>
                {priorityMap[p]}
              </option>
            ))}
          </select>
          {errors.prioridad && <p className={styles.errorMessage}>{errors.prioridad.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoria_id">Categoría</label>
          <select
            id="categoria_id"
            {...register('categoria_id')}
            disabled={isSubmitting}
            className={errors.categoria_id ? styles.inputError : ''}
          >
            <option value="">Sin Categoría</option>
            {categories?.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && <p className={styles.errorMessage}>{errors.categoria_id.message}</p>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fecha_vencimiento">Fecha de Vencimiento</label>
        <input
          type="date"
          id="fecha_vencimiento"
          {...register('fecha_vencimiento')}
          disabled={isSubmitting}
          className={errors.fecha_vencimiento ? styles.inputError : ''}
        />
        {errors.fecha_vencimiento && <p className={styles.errorMessage}>{errors.fecha_vencimiento.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Etiquetas</label>
        <div className={styles.tagsContainer}>
          {tags?.map((tag) => (
            <label key={tag.id} className={styles.tagLabel}>
              <input
                type="checkbox"
                value={tag.nombre}
                checked={selectedTagNames.includes(tag.nombre)}
                onChange={() => handleTagChange(tag.nombre)}
                disabled={isSubmitting}
              />
              {tag.nombre}
            </label>
          ))}
        </div>
        {errors.tagNames && <p className={styles.errorMessage}>{errors.tagNames.message}</p>}
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} disabled={isSubmitting} className={styles.cancelButton}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskFormModal;
