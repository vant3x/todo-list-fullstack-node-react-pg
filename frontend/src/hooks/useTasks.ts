import { useState, useEffect } from 'react';
import api from '../services/api';
import { Task, Priority, CreateTaskPayload, UpdateTaskPayload } from '../types'; // Import new types

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskPayload) => Promise<void>; // Use CreateTaskPayload
  updateTask: (id: string, data: UpdateTaskPayload) => Promise<void>; // Use UpdateTaskPayload
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tareas');
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: CreateTaskPayload) => { // Use CreateTaskPayload
    try {
      const response = await api.post('/tareas', data);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear tarea');
      throw err;
    }
  };

  const updateTask = async (id: string, data: UpdateTaskPayload) => { // Use UpdateTaskPayload
    try {
      const response = await api.put(`/tareas/${id}`, data);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar tarea');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tareas/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
      throw err;
    }
  };

  const toggleTaskCompleted = async (id: string) => {
    try {
      const response = await api.patch(`/tareas/${id}/completar`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar estado de tarea');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompleted };
};
