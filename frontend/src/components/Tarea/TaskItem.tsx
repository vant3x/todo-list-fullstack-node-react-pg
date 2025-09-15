import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import * as Types from '../../types';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Types.Task;
  onToggleComplete: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask, onTaskUpdated }) => {
  const handleToggleCompleted = async () => {
    try {
      await onToggleComplete(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Error toggling task completed status:', error);
    }
  };

  const handleEdit = () => {
    console.log('Edit task:', task.id);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await onDeleteTask(task.id);
        onTaskUpdated();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
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
        {task.fecha_vencimiento && <span className={styles.dueDate}>Due: {new Date(task.fecha_vencimiento).toLocaleDateString()}</span>}
        {task.category && <span className={styles.category}>{task.category.nombre}</span>}
        {task.tags && task.tags.length > 0 && (
          <div className={styles.tags}>
            {task.tags.map(tag => <span key={tag.id} className={styles.tag}>{tag.nombre}</span>)}
          </div>
        )}
      </div>
      <div className={styles.taskActions}>
        <button onClick={handleEdit} className={styles.editButton}><Pencil size={16} /> Editar</button>
        <button onClick={handleDelete} className={styles.deleteButton}><Trash2 size={16} /> Eliminar</button>
      </div>

        </div>
      );
    };

export default TaskItem;
