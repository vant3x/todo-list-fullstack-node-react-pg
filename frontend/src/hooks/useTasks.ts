import { useState, useEffect } from 'react';
import api from '../services/api';
import * as Types from '../types'; // Use namespace import for types

interface UseTasksResult {
  tasks: Types.Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: Types.CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, data: Types.UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Types.Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: Types.CreateTaskPayload) => {
    try {
      const response = await api.post('/tareas', data);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear tarea');
      throw err;
    }
  };

  const updateTask = async (id: string, data: Types.UpdateTaskPayload) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
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
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
      throw err;
    }
  };

  const toggleTaskCompleted = async (id: string) => {
    try {
      const response = await api.patch(`/tasks/${id}/completar`);
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
