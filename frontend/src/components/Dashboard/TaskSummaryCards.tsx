import React, { useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import * as Types from '../../types';
import styles from './TaskSummaryCards.module.css';

const TaskSummaryCards: React.FC = () => {
  const { tasks, loadingTasks, tasksError } = useApp();

  const summary = useMemo(() => {
    if (!tasks) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
      };
    }

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

  if (loadingTasks) {
    return <div className={styles.loading}>Cargando resumen de tareas...</div>;
  }

  if (tasksError) {
    return <div className={styles.error}>Error al cargar resumen de tareas: {tasksError}</div>;
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
