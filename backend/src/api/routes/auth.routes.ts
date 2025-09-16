import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../../core/services/auth.service';
import { registerUserSchema, loginUserSchema } from '../schemas/auth.schema';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const user = await AuthService.register(validatedData);
    res.status(StatusCodes.CREATED).json({ message: 'Usuario registrado exitosamente.', user });
  } catch (error) {
    next(error);
  }
};

router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const result = await AuthService.login(validatedData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

router.post('/login', loginUser);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
const getProfile = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(req.user);
};

router.get('/profile', protect, getProfile);

export default router;