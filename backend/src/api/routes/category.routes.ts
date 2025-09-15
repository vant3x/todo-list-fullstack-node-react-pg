import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';
import { createCategoryInputSchema, updateCategoryInputSchema } from '../schemas/category.schema';
import { CategoryService } from '../../core/services/category.service';

const router = Router();

// Aplicamos el middleware `protect` a todas las rutas de este archivo
router.use(protect);

/**
 * @route   POST /api/categories
 * @desc    Crea una nueva categoría
 * @access  Private
 */
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

/**
 * @route   GET /api/categories
 * @desc    Obtiene todas las categorías del usuario autenticado
 * @access  Private
 */
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

/**
 * @route   GET /api/categories/:id
 * @desc    Obtiene una categoría específica por su ID
 * @access  Private
 */
const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // No hay un método getByIdForUser en el servicio, pero podemos usar findById y verificar la propiedad
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

/**
 * @route   PUT /api/categories/:id
 * @desc    Actualiza una categoría existente
 * @access  Private
 */
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

/**
 * @route   DELETE /api/categories/:id
 * @desc    Elimina una categoría existente
 * @access  Private
 */
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
