import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { z } from 'zod';

import  type { Category } from '../interfaces/Category';

export const createCategorySchema = z.object({
  nombre: z.string().min(1, "El nombre de la categoría es requerido"),
});

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;

const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/categorias');
  return response.data;
};

const createCategory = async (newCategory: CreateCategoryPayload): Promise<Category> => {
  const response = await api.post('/api/categorias', newCategory);
  return response.data;
};

const updateCategory = async (updatedCategory: Category): Promise<Category> => {
  const response = await api.put(`/api/categorias/${updatedCategory.id}`, updatedCategory);
  return response.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categorias/${id}`);
};

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const addCategoryMutation = useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategoryMutation = useMutation<Category, Error, Category>({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    isLoading,
    error,
    addCategory: addCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isAdding: addCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    addError: addCategoryMutation.error,
    updateError: updateCategoryMutation.error,
    deleteError: deleteCategoryMutation.error,
  };
};
