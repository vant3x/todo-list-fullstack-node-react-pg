import React, { useState } from 'react';
import TaskList from '../components/Tarea/TaskList';
import TaskFormModal from '../components/Tarea/TaskFormModal';
import Modal from '../components/shared/Modal/Modal';
import TaskDownloadButtons from '../components/Tarea/TaskDownloadButtons'; 
import { useTasks } from '../hooks/useTasks';
import { Plus } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks } = useTasks(); 

  const handleTaskFormSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-page">
      <button onClick={() => setIsModalOpen(true)}><Plus size={16} /> Agregar Nueva Tarea</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nueva Tarea">
        <TaskFormModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTaskFormSuccess}
        />
      </Modal>

      <TaskDownloadButtons tasks={tasks} /> 

      <TaskList />
    </div>
  );
};

export default DashboardPage;