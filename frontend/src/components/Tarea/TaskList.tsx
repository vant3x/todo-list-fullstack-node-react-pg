import React from 'react';
import { useApp } from '../../hooks/useApp';
import TaskItem from './TaskItem';
import LoadingSpinner from '../shared/LoadingSpinner';
import styles from './TaskList.module.css';
import * as Types from '../../types';

interface TaskListProps {
  onEditTask: (task: Types.Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { tasks, loadingTasks, tasksError, toggleTaskCompleted, deleteTask } = useApp();

  if (loadingTasks) {
    return <LoadingSpinner />;
  }

  if (tasksError) {
    return <div className={styles.error}>Error: {tasksError}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas creadas aún.</p>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompleted}
              onDeleteTask={deleteTask}
              onEdit={() => onEditTask(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
