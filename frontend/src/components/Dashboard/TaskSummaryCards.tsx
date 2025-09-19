import React, { useMemo } from 'react';
import * as Types from '../../types';
import styles from './TaskSummaryCards.module.css';

interface TaskSummaryCardsProps {
  tasks: Types.Task[];
  isLoading: boolean;
}

const TaskSummaryCards: React.FC<TaskSummaryCardsProps> = ({ tasks, isLoading }) => {
  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completada).length;
    const pending = total - completed;
    const highPriority = tasks.filter(task => task.prioridad === Types.Priority.ALTA).length;

    return {
      total,
      completed,
      pending,
      highPriority,
    };
  }, [tasks]);

  if (isLoading) {
    return <div className={styles.loading}>Cargando resumen de tareas...</div>;
  }

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <h3>Total Tareas</h3>
        <p>{summary.total}</p>
      </div>
      <div className={styles.card}>
        <h3>Completadas</h3>
        <p>{summary.completed}</p>
      </div>
      <div className={styles.card}>
        <h3>Pendientes</h3>
        <p>{summary.pending}</p>
      </div>
      <div className={styles.card}>
        <h3>Alta Prioridad</h3>
        <p>{summary.highPriority}</p>
      </div>
    </div>
  );
};

export default TaskSummaryCards;
