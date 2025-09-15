import { Prisma } from '@prisma/client';
import { CategoryRepository } from '../repositories/category.repository';
import { ApiError } from '../../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

export type CreateCategoryData = Omit<Prisma.CategoriaCreateInput, 'usuario'>;

export const CategoryService = {
  async create(userId: string, categoryData: CreateCategoryData) {
    // Opcional: Verificar si ya existe una categoría con el mismo nombre para este usuario
    // const existingCategory = await CategoryRepository.findByNameAndUserId(categoryData.nombre, userId);
    // if (existingCategory) {
    //   throw new ApiError(StatusCodes.CONFLICT, 'Ya existe una categoría con este nombre.');
    // }

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
