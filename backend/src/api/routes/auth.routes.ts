import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../../core/services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @route   POST /api/auth/registro
 * @desc    Registra un nuevo usuario
 * @access  Public
 */
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validar el body de la petición con el esquema de Zod
    const validatedData = registerSchema.parse(req.body);

    // 2. Llamar al servicio para crear el usuario
    const user = await AuthService.register(validatedData);

    // 3. Enviar la respuesta
    res.status(StatusCodes.CREATED).json({
      message: 'Usuario registrado exitosamente.',
      user,
    });
  } catch (error) {
    // Si ocurre cualquier error (validación o de servicio), se pasa al manejador de errores
    next(error);
  }
};

router.post('/registro', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica a un usuario y devuelve un token
 * @access  Public
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validar el body
    const validatedData = loginSchema.parse(req.body);

    // 2. Llamar al servicio de login
    const result = await AuthService.login(validatedData);

    // 3. Enviar el token en la respuesta
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

router.post('/login', loginUser);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtiene el perfil del usuario autenticado
 * @access  Private
 */
import { protect } from '../middleware/auth.middleware';

const getProfile = (req: Request, res: Response) => {
  // Si llegamos aquí, el middleware `protect` ya ha validado el token
  // y ha adjuntado el usuario a `req.user`.
  res.status(StatusCodes.OK).json(req.user);
};

// Aplicamos el middleware `protect` antes del controlador `getProfile`
router.get('/perfil', protect, getProfile);


export default router;