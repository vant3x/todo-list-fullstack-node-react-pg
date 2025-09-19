import React from 'react';
import TaskItem from './TaskItem';
import LoadingSpinner from '../shared/LoadingSpinner';
import styles from './TaskList.module.css';
import * as Types from '../../types';
import { ListChecks } from 'lucide-react';
import { useTaskMutations } from '../../hooks/useTasks'; // 1. Importar el hook de mutaciones

interface TaskListProps {
  tasks: Types.Task[];
  isLoading: boolean;
  error: string | null;
  onEditTask: (task: Types.Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error, onEditTask }) => {
  // 2. Obtener las funciones para modificar tareas desde el hook
  const { deleteTask, toggleTask } = useTaskMutations();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const handleToggleComplete = (task: Types.Task) => {
    toggleTask({ id: task.id, completada: !task.completada });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}><ListChecks /> Mis Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas para los filtros seleccionados.</p>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              // 3. Usar las nuevas funciones
              onToggleComplete={() => handleToggleComplete(task)}
              onDeleteTask={() => handleDeleteTask(task.id)}
              onEdit={() => onEditTask(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
