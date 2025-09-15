import { Etiqueta } from '@prisma/client';
import { TagRepository } from '../repositories/tag.repository';
import { ApiError } from '../../utils/ApiError';

export const TagService = {
  async createTag(nombre: string, userId: string): Promise<Etiqueta> {
    const existingTag = await TagRepository.findByNameAndUserId(nombre, userId);
    if (existingTag) {
      throw new ApiError(409, 'Ya existe una etiqueta con este nombre para este usuario.');
    }

    return TagRepository.create({
      nombre,
      usuario: {
        connect: { id: userId },
      },
    });
  },

  async getTagsByUserId(userId: string): Promise<Etiqueta[]> {
    return TagRepository.findByUserId(userId);
  },

  async findOrCreateByNames(userId: string, tagNames: string[]): Promise<string[]> {
    const tagIds: string[] = [];

    for (const name of tagNames) {
      let tag = await TagRepository.findByNameAndUserId(name, userId);
      if (!tag) {
        tag = await TagRepository.create({
          nombre: name,
          usuario: { connect: { id: userId } },
        });
      }
      tagIds.push(tag.id);
    }

    return tagIds;
  },
};
