import React, { useState } from 'react';
import TaskList from '../components/Tarea/TaskList';
import TaskFormModal from '../components/Tarea/TaskFormModal';
import Modal from '../components/shared/Modal/Modal';
import TaskDownloadButtons from '../components/Tarea/TaskDownloadButtons';
import TaskFilter from '../components/Tarea/TaskFilter';
import { useTasks, useTaskMutations } from '../hooks/useTasks';
import { useFilters } from '../context/filters/FilterContext';
import * as Types from '../types';
import { Plus } from 'lucide-react';
import TaskSummaryCards from '../components/Dashboard/TaskSummaryCards';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Types.Task | undefined>(undefined);
  
  const { filters, setFilters } = useFilters();

  const { data: tasks, isLoading, isError, error } = useTasks(filters);
  const { createTask, updateTask } = useTaskMutations();

  const handleOpenCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Types.Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
  };

  return (
    <div className="dashboard-page">
      <TaskSummaryCards tasks={tasks || []} isLoading={isLoading} />

      {/* Contenedor para los botones de acción */}
      <div className={styles.pageActions}>
        <TaskDownloadButtons tasks={tasks || []} />
        <button onClick={handleOpenCreateModal}>
          <Plus size={16} /> Agregar Nueva Tarea
        </button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
        >
          <TaskFormModal
            initialData={editingTask}
            onClose={handleCloseModal}
            createTask={createTask}
            updateTask={updateTask}
            onSuccess={handleFormSuccess}
          />
        </Modal>
      )}

      <TaskFilter />

      <TaskList 
        tasks={tasks || []} 
        isLoading={isLoading}
        error={isError ? error.message : null}
        onEditTask={handleOpenEditModal} 
      />
    </div>
  );
};

export default DashboardPage;
