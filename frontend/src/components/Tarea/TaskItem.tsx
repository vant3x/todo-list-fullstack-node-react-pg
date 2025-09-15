import React from 'react';
import * as Types from '../../types'; 
import { useTasks } from '../../hooks/useTasks'; 
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Types.Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const { toggleTaskCompleted, deleteTask } = useTasks(); 
  const handleToggleCompleted = async () => {
    try {
      await toggleTaskCompleted(task.id);
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
        await deleteTask(task.id);
        onTaskDeleted(); 
      } catch (error) {
        console.error('Error deleting task:', error);
      
      }
    }
  };

  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.taskInfo}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompleted}
        />
        <h3>{task.titulo}</h3>
        {task.description && <p>{task.description}</p>}
        {task.dueDate && <span className={styles.dueDate}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
        {task.category && <span className={styles.category}>{task.category.name}</span>}
        {task.tags && task.tags.length > 0 && (
          <div className={styles.tags}>
            {task.tags.map(tag => <span key={tag.id} className={styles.tag}>{tag.name}</span>)}
          </div>
        )}
      </div>
      <div className={styles.taskActions}>
        <button onClick={handleEdit} className={styles.editButton}>Editar</button>
        <button onClick={handleDelete} className={styles.deleteButton}>Eliminar</button>
      </div>

        </div>
      );
    };

export default TaskItem;
