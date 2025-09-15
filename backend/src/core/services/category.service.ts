import { Prisma } from '@prisma/client';
import { CategoryRepository } from '../repositories/category.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

export type CreateCategoryData = Omit<Prisma.CategoriaCreateInput, 'usuario'>;

export const CategoryService = {
  async create(userId: string, categoryData: CreateCategoryData) {
   

    const category = await CategoryRepository.create({
      ...categoryData,
      usuario: {
        connect: { id: userId },
      },
    });
    return category;
  },

  async getAllForUser(userId: string) {
    return CategoryRepository.findByUserId(userId);
  },

  async update(userId: string, categoryId: string, categoryData: Prisma.CategoriaUpdateInput) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La categoría no fue encontrada.');
    }

    if (category.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La categoría no fue encontrada.');
    }

    return CategoryRepository.update(categoryId, categoryData);
  },

  async delete(userId: string, categoryId: string) {
    const category = await CategoryRepository.findById(categoryId);
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La categoría no fue encontrada.');
    }

    if (category.usuario_id !== userId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'La categoría no fue encontrada.');
    }

    return CategoryRepository.delete(categoryId);
  },
};
