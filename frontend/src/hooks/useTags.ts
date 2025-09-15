import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { z } from 'zod';


export interface Tag {
  id: string;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
  usuario_id: string;
}

export const createTagSchema = z.object({
  nombre: z.string().min(1, "El nombre de la etiqueta es requerido"),
});

export type CreateTagPayload = z.infer<typeof createTagSchema>;

const getTags = async (): Promise<Tag[]> => {
  const response = await api.get('/api/etiquetas');
  return response.data;
};

const createTag = async (newTag: CreateTagPayload): Promise<Tag> => {
  const response = await api.post('/api/etiquetas', newTag);
  return response.data;
};

const updateTag = async (updatedTag: Tag): Promise<Tag> => {
  const response = await api.put(`/api/etiquetas/${updatedTag.id}`, updatedTag);
  return response.data;
};

const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/api/etiquetas/${id}`);
};


export const useTags = () => {
  const queryClient = useQueryClient();

  const { data: tags, isLoading, error } = useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  const addTagMutation = useMutation<Tag, Error, CreateTagPayload>({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] }); 
    },
  });

  const updateTagMutation = useMutation<Tag, Error, Tag>({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

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

