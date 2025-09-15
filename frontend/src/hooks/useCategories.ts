import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../config/axios';
import { z } from 'zod';

import  type { Category } from '../interfaces/Category';

// --- Interfaces and Schemas ---
// Zod schema for creating a category (matches backend createCategoryInputSchema)
export const createCategorySchema = z.object({
  nombre: z.string().min(1, "El nombre de la categoría es requerido"),
});

// Infer type from schema
export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;

// --- API Functions ---
const getCategories = async (): Promise<Category[]> => {
  const response = await axiosClient.get('/api/categorias');
  return response.data;
};

const createCategory = async (newCategory: CreateCategoryPayload): Promise<Category> => {
  const response = await axiosClient.post('/api/categorias', newCategory);
  return response.data;
};

const updateCategory = async (updatedCategory: Category): Promise<Category> => {
  const response = await axiosClient.put(`/api/categorias/${updatedCategory.id}`, updatedCategory);
  return response.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/categorias/${id}`);
};

// --- Custom Hook ---
export const useCategories = () => {
  const queryClient = useQueryClient();

  // Query for fetching all categories
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Mutation for creating a category
  const addCategoryMutation = useMutation<Category, Error, CreateCategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Invalidate and refetch categories
    },
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation<Category, Error, Category>({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Mutation for deleting a category
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
