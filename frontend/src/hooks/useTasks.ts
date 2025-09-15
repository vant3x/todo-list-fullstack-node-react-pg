import { useState, useEffect } from 'react';
import api from '../services/api';
import * as Types from '../types'; 

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
      const response = await api.get('/tareas'); 
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: Types.CreateTaskPayload) => {
    try {
      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        prioridad: data.prioridad,
        fecha_vencimiento: data.fecha_vencimiento,
        categoria_id: data.categoria_id,
        tagNames: data.tagNames,
      };
      const response = await api.post('/tareas', payload);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear tarea');
      throw err;
    }
  };

  const updateTask = async (id: string, data: Types.UpdateTaskPayload) => {
    try {
      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        completada: data.completada, 
        prioridad: data.prioridad,
        fecha_vencimiento: data.fecha_vencimiento,
        categoria_id: data.categoria_id,
        tagNames: data.tagNames,
      };
      const response = await api.put(`/tareas/${id}`, payload);
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
    const originalTasks = tasks;
    let newCompletadaStatus: boolean;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          newCompletadaStatus = !task.completada;
          return { ...task, completada: newCompletadaStatus };
        }
        return task;
      })
    );

    try {
      if (newCompletadaStatus === undefined) {
        const taskToUpdate = originalTasks.find(task => task.id === id);
        if (taskToUpdate) {
          newCompletadaStatus = !taskToUpdate.completada;
        } else {
          throw new Error('Task not found for optimistic update');
        }
      }

      const response = await api.patch(`/tareas/${id}/complete`, { completada: newCompletadaStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err: any) {
      setTasks(originalTasks);
      setError(err.response?.data?.message || 'Error al cambiar estado de tarea');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompleted };
};