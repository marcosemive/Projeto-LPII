import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import router from '@/routes/index.js';
import { validarContentType } from '@/middlewares/contentType.js';
import { errorHandler } from '@/middlewares/errorHandler.js';
 
const server = express();
 
server.use(morgan('dev'));
 
server.use(express.json());

server.use(validarContentType);
 
server.use(express.static('public'));
 
server.use('/api', router);
 
server.get('/', (req: Request, res: Response): void => {
  res.redirect('/paginainicial.html');
});

server.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Content not found!' });
});

server.use(errorHandler);
 
server.listen(3000, (): void => {
  console.log('Server is running on port 3000');
});
