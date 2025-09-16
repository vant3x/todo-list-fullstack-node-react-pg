import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../../utils/validate';
import { createTagInputSchema } from '../schemas/tag.schema';
import { TagService } from '../../core/services/tag.service';
import { ApiError } from '../../utils/ApiError';

const router = Router();

/**
 * @swagger
 * /tags:
 *   post:
 *     tags:
 *       - Tags
 *     summary: Create a new tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagInput'
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  protect,
  validate(createTagInputSchema),
  async (req, res, next) => {
    try {
      const { nombre } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'Usuario no autenticado.');
      }

      const tag = await TagService.createTag(nombre, userId);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get all tags for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tags
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  protect,
  async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'Usuario no autenticado.');
      }

      const tags = await TagService.getTagsByUserId(userId);
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  }
);

export default router;