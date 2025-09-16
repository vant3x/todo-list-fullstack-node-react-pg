import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

config();

const app: Application = express();
const port = process.env.PORT || 3001;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Demasiadas solicitudes desde esta IP, por fvor intente de nuevo en 15 minutos',
});


app.use(morgan('dev')); 
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(limiter);

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: '¡La API está funcionando correctamente!' });
});

import mainApiRouter from './api/routes'; 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { errorHandler } from './api/middleware/errorHandler';

app.use('/api', mainApiRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});