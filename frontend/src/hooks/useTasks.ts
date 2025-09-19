
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import * as Types from '../types';
import { useSnackbar } from '../context/snackbar/SnackbarContext';
import type { TaskFilters } from '../types';



const fetchTasks = async (filters: TaskFilters): Promise<Types.Task[]> => {

  const params: Record<string, any> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'etiquetas' && Array.isArray(value)) {
        params[key] = value.join(',');
      } else {
        params[key] = value;
      }
    }
  }

  const { data } = await api.get('/tareas', { params });
  return data;
};

export const useTasks = (filters: TaskFilters) => {
  return useQuery<Types.Task[], Error>({

    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
    keepPreviousData: true, 
  });
};


export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    showSnackbar(message, 'success');
  };

  const onError = (error: any, defaultMessage: string) => {
    const message = error?.response?.data?.message || defaultMessage;
    showSnackbar(message, 'error');
  };

  const createTaskMutation = useMutation({
    mutationFn: (newTask: Types.CreateTaskPayload) => api.post<Types.Task>('/tareas', newTask),
    onSuccess: () => onSuccess('Tarea creada exitosamente.'),
    onError: (error) => onError(error, 'Error al crear la tarea.'),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, taskData }: { id: string; taskData: Types.UpdateTaskPayload }) =>
      api.put<Types.Task>(`/tareas/${id}`, taskData),
    onSuccess: () => onSuccess('Tarea actualizada exitosamente.'),
    onError: (error) => onError(error, 'Error al actualizar la tarea.'),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tareas/${id}`),
    onSuccess: () => onSuccess('Tarea eliminada exitosamente.'),
    onError: (error) => onError(error, 'Error al eliminar la tarea.'),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completada }: { id: string; completada: boolean }) =>
      api.patch<Types.Task>(`/tareas/${id}/complete`, { completada }),
    onSuccess: () => onSuccess('Estado de la tarea actualizado.'),
    onError: (error) => onError(error, 'Error al cambiar el estado.'),
  });

  return {
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTask: toggleTaskMutation.mutateAsync,
  };
};
