import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';

config();

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev')); 
app.use(express.json()); 

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: '¡La API está funcionando correctamente!' });
});

import mainApiRouter from './api/routes'; 
app.use('/api', mainApiRouter);

import { errorHandler } from './api/middleware/errorHandler';
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});