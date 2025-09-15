import React, { useState } from 'react';
import TaskList from '../components/Tarea/TaskList';
import TaskForm from '../components/Tarea/TaskForm'; 

const DashboardPage: React.FC = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false); 
  };

  return (
    <div className="dashboard-page">
      <button onClick={() => setShowTaskForm(true)}>Agregar Nueva Tarea</button>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleTaskFormSuccess}
        />
      )}

      <TaskList />
    </div>
  );
};

export default DashboardPage;