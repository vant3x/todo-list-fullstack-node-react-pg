import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev')); 
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:5173' })); 

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