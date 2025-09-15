import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';

// Cargar variables de entorno al inicio de la aplicación
config();

const app: Application = express();
const port = process.env.PORT || 3001;

// --- Middlewares ---
app.use(morgan('dev')); // Middleware para logging de requests en modo desarrollo
app.use(express.json()); // Middleware para parsear bodies con JSON

// --- Rutas ---

// Ruta de prueba para verificar que la API está viva
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: '¡La API está funcionando correctamente!' });
});

// Aquí registraremos las rutas de nuestra aplicación
import authRoutes from './api/routes/auth.routes';
app.use('/api/auth', authRoutes);

import taskRoutes from './api/routes/task.routes';
app.use('/api/tareas', taskRoutes);

// --- Manejo de Errores ---
// Debe ser el último middleware que se registra
import { errorHandler } from './api/middleware/errorHandler';
app.use(errorHandler);


// --- Iniciar Servidor ---
app.listen(port, () => {
  console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});