import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

const TaskList: React.FC = () => {
  const { tasks, loading, error, fetchTasks } = useTasks();

  if (loading) {
    return <div className={styles.loading}>Cargando tareas...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Mis Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas creadas aún.</p>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdated={fetchTasks} onTaskDeleted={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
