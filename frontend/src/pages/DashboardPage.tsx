import React, { useState, useEffect } from 'react';
import TaskList from '../components/Tarea/TaskList';
import TaskFormModal from '../components/Tarea/TaskFormModal';
import Modal from '../components/shared/Modal/Modal';
import TaskDownloadButtons from '../components/Tarea/TaskDownloadButtons';
import { useApp } from '../hooks/useApp';
import * as Types from '../types';
import { Plus } from 'lucide-react';
import TaskSummaryCards from '../components/Dashboard/TaskSummaryCards';

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Types.Task | undefined>(undefined);
  const { tasks, fetchTasks } = useApp();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  return (
    <div className="dashboard-page">
      <TaskSummaryCards />
      <button onClick={handleOpenCreateModal}>
        <Plus size={16} /> Agregar Nueva Tarea
      </button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
        >
          <TaskFormModal
            initialData={editingTask}
            onClose={handleCloseModal}
            onSuccess={handleCloseModal} // onSuccess just closes the modal, context handles the update
          />
        </Modal>
      )}

      <TaskDownloadButtons tasks={tasks} />

      <TaskList onEditTask={handleOpenEditModal} />
    </div>
  );
};

export default DashboardPage;
