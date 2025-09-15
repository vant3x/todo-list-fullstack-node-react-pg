import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../../utils/validate'; 
import { createTagInputSchema } from '../schemas/tag.schema';
import { TagService } from '../../core/services/tag.service';
import { ApiError } from '../../utils/ApiError';

const router = Router();

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
