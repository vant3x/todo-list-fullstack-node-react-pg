import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';
import { createCategoryInputSchema, updateCategoryInputSchema } from '../schemas/category.schema';
import { CategoryService } from '../../core/services/category.service';
import { ApiError } from '../../utils/ApiError';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategoryInputSchema.parse(req.body);
    const userId = req.user!.id;
    const category = await CategoryService.create(userId, validatedData);
    res.status(StatusCodes.CREATED).json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const categories = await CategoryService.getAllForUser(userId);
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get a category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const category = await CategoryService.getByIdForUser(userId, id);
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Categoría no encontrada.');
    }
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const validatedData = updateCategoryInputSchema.parse(req.body);
    const updatedCategory = await CategoryService.update(userId, id, validatedData);
    res.status(StatusCodes.OK).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    await CategoryService.delete(userId, id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export default router;
