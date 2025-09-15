import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';
import { createCategoryInputSchema, updateCategoryInputSchema } from '../schemas/category.schema';
import { CategoryService } from '../../core/services/category.service';
import { ApiError } from "../../utils/ApiError"; 

const router = Router();

router.use(protect);


const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategoryInputSchema.parse(req.body);
    const userId = req.user!.id;

    const category = await CategoryService.create(userId, validatedData);

    res.status(StatusCodes.CREATED).json(category);
  } catch (error) {
    next(error);
  }
};

router.post('/', createCategory);


const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const categories = await CategoryService.getAllForUser(userId);
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    next(error);
  }
};

router.get('/', getCategories);


const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const category = await CategoryService.getAllForUser(userId);
    const foundCategory = category.find(cat => cat.id === id);

    if (!foundCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Categoría no encontrada.');
    }

    res.status(StatusCodes.OK).json(foundCategory);
  } catch (error) {
    next(error);
  }
};

router.get('/:id', getCategoryById);


const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const validatedData = updateCategoryInputSchema.parse(req.body);

    const updatedCategory = await CategoryService.update(userId, id, validatedData);

    res.status(StatusCodes.OK).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

router.put('/:id', updateCategory);

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await CategoryService.delete(userId, id);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

router.delete('/:id', deleteCategory);

export default router;
