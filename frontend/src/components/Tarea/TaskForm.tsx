import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import * as Types from '../../types'; 
import styles from './TaskForm.module.css';

interface TaskFormProps {
  initialData?: Types.Task; 
  onClose?: () => void;
  onSuccess?: () => void; 
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onClose, onSuccess }) => {
  const { createTask, updateTask } = useTasks();
  const { categories } = useCategories();
  const { tags } = useTags();

  const [title, setTitle] = useState(initialData?.titulo || '');
  const [description, setDescription] = useState(initialData?.descripcion || '');
  const [priority, setPriority] = useState<Types.Priority>(initialData?.prioridad || Types.Priority.LOW);
  const [dueDate, setDueDate] = useState(initialData?.fecha_vencimiento ? initialData.fecha_vencimiento.split('T')[0] : '');
  const [categoryId, setCategoryId] = useState(initialData?.categoria_id || '');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>(initialData?.tags?.map(tag => tag.nombre) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.titulo);
      setDescription(initialData.descripcion || '');
      setPriority(initialData.prioridad);
      setDueDate(initialData.fecha_vencimiento ? initialData.fecha_vencimiento.split('T')[0] : '');
      setCategoryId(initialData.categoria_id || '');
      setSelectedTagNames(initialData.tags?.map(tag => tag.nombre) || []);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload: Types.CreateTaskPayload | Types.UpdateTaskPayload = {
      titulo: title,
      descripcion: description || undefined,
      prioridad: priority,
      fecha_vencimiento: dueDate || undefined,
      categoria_id: categoryId || undefined,
      tagNames: selectedTagNames.length > 0 ? selectedTagNames : undefined,
    };

    try {
      if (initialData) {
        await updateTask(initialData.id, payload as Types.UpdateTaskPayload);
      } else {
        await createTask(payload as Types.CreateTaskPayload);
      }
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagChange = (tagName: string) => {
    setSelectedTagNames(prev =>
      prev.includes(tagName) ? prev.filter(nombre => nombre !== tagName) : [...prev, tagName]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="priority">Prioridad</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value) as Types.Priority)}
          disabled={isSubmitting}
        >
          {Object.values(Types.Priority).filter(value => typeof value === 'number').map((p) => (
            <option key={p} value={p}>
              {Types.Priority[p as number]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Fecha de Vencimiento</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="">Sin Categoría</option>
          {categories?.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.nombre}
            </option>
          ))}
        </select>
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
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
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

export default TaskForm;
