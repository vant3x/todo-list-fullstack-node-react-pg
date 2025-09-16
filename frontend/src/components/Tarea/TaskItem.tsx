import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import * as Types from '../../types';
import styles from './TaskItem.module.css';
import DeleteConfirmationModal from '../shared/Modal/DeleteConfirmationModal';

interface TaskItemProps {
  task: Types.Task;
  onToggleComplete: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleCompleted = async () => {
    try {
      await onToggleComplete(task.id);
    } catch (error) {
      console.error('Error toggling task completed status:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDeleteTask(task.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className={`${styles.taskItem} ${task.completada ? styles.completed : ''}`}>
      <div className={styles.taskInfo}>
        <input
          type="checkbox"
          checked={task.completada}
          onChange={handleToggleCompleted}
        />
        <h3>{task.titulo}</h3>
        {task.descripcion && <p>{task.descripcion}</p>}
        {task.fecha_vencimiento && <span className={styles.dueDate}>Vence: {new Date(task.fecha_vencimiento).toLocaleDateString()}</span>}
        {task.categoria && <span className={styles.category}>{task.categoria.nombre}</span>}
        {task.etiquetas && task.etiquetas.length > 0 && (
          <div className={styles.tags}>
            {task.etiquetas.map(tag => <span key={tag.id} className={styles.tag}>{tag.nombre}</span>)}
          </div>
        )}
      </div>
      <div className={styles.taskActions}>
        <button onClick={onEdit} className={styles.editButton}><Pencil size={16} /> Editar</button>
        <button onClick={handleDeleteClick} className={styles.deleteButton}><Trash2 size={16} /> Eliminar</button>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Estás seguro de que quieres eliminar la tarea "${task.titulo}"?`}
      />
    </div>
  );
};

export default TaskItem;
