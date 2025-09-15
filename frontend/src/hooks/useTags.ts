import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../config/axios';
import { z } from 'zod';

// --- Interfaces and Schemas ---
// Matches backend Etiqueta model
export interface Tag {
  id: string;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
  usuario_id: string;
}

// Zod schema for creating a tag (matches backend createTagInputSchema)
export const createTagSchema = z.object({
  nombre: z.string().min(1, "El nombre de la etiqueta es requerido"),
});

// Infer type from schema
export type CreateTagPayload = z.infer<typeof createTagSchema>;

// --- API Functions ---
const getTags = async (): Promise<Tag[]> => {
  const response = await axiosClient.get('/api/etiquetas');
  return response.data;
};

const createTag = async (newTag: CreateTagPayload): Promise<Tag> => {
  const response = await axiosClient.post('/api/etiquetas', newTag);
  return response.data;
};

const updateTag = async (updatedTag: Tag): Promise<Tag> => {
  const response = await axiosClient.put(`/api/etiquetas/${updatedTag.id}`, updatedTag);
  return response.data;
};

const deleteTag = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/etiquetas/${id}`);
};

// --- Custom Hook ---
export const useTags = () => {
  const queryClient = useQueryClient();

  // Query for fetching all tags
  const { data: tags, isLoading, error } = useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Mutation for creating a tag
  const addTagMutation = useMutation<Tag, Error, CreateTagPayload>({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] }); // Invalidate and refetch tags
    },
  });

  // Mutation for updating a tag
  const updateTagMutation = useMutation<Tag, Error, Tag>({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  // Mutation for deleting a tag
  const deleteTagMutation = useMutation<void, Error, string>({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return {
    tags,
    isLoading,
    error,
    addTag: addTagMutation.mutateAsync,
    updateTag: updateTagMutation.mutateAsync,
    deleteTag: deleteTagMutation.mutateAsync,
    isAdding: addTagMutation.isPending,
    isUpdating: updateTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending,
    addError: addTagMutation.error,
    updateError: updateTagMutation.error,
    deleteError: deleteTagMutation.error,
  };
};
