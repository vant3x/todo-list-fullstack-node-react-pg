import React, { useReducer, useCallback, useEffect } from 'react';
import AppContext from './AppContext';
import { appReducer } from './AppReducer';
import type { AppState as AppReducerState } from './AppReducer';
import api from '../../services/api';
import * as Types from '../../types';

interface AppStateProps {
  children: React.ReactNode;
}

const initialState: AppReducerState = {
  tasks: [],
  loadingTasks: true,
  tasksError: null,
  categories: [],
  loadingCategories: true,
  categoriesError: null,
};

const AppState: React.FC<AppStateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'FETCH_TASKS_START' });
    try {
      const response = await api.get<Types.Task[]>('/tareas');
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: response.data });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cargar tareas';
      dispatch({ type: 'FETCH_TASKS_ERROR', payload: errorMsg });
    }
  }, []);

  const createTask = async (data: Types.CreateTaskPayload) => {
    try {
      const response = await api.post<Types.Task>('/tareas', data);
      dispatch({ type: 'ADD_TASK', payload: response.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al crear la tarea');
    }
  };

  const updateTask = async (id: string, data: Types.UpdateTaskPayload) => {
    try {
      const response = await api.put<Types.Task>(`/tareas/${id}`, data);
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al actualizar la tarea');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tareas/${id}`);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al eliminar la tarea');
    }
  };

  const toggleTaskCompleted = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const response = await api.patch<Types.Task>(`/tareas/${id}/complete`, { completada: !task.completada });
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al cambiar estado de tarea');
    }
  };

  const fetchCategories = useCallback(async () => {
    dispatch({ type: 'FETCH_CATEGORIES_START' });
    try {
      const response = await api.get<Types.Category[]>('/categorias');
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: response.data });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cargar categorías';
      dispatch({ type: 'FETCH_CATEGORIES_ERROR', payload: errorMsg });
    }
  }, []);

  const createCategory = async (data: Types.CreateCategoryPayload) => {
    try {
      const response = await api.post<Types.Category>('/categorias', data);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al crear la categoría');
    }
  };

  const updateCategory = async (id: string, data: Types.CreateCategoryPayload) => {
    try {
      const response = await api.put<Types.Category>(`/categorias/${id}`, data);
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al actualizar la categoría');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categorias/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (err: any) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;