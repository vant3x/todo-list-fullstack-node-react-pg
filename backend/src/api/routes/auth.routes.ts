import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../../core/services/auth.service';
import { registerUserSchema, loginUserSchema} from '../schemas/auth.schema';
import { StatusCodes } from 'http-status-codes';
import { protect } from '../middleware/auth.middleware';

const router = Router();

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

const getProfile = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(req.user);
};

router.get('/profile', protect, getProfile);

export default router;