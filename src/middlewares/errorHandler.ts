import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@/errors/index.js';

export function errorHandler(err: HttpError | Error, req: Request, res: Response, next: NextFunction): void {
  if ('statusCode' in err) {
    const httpErr = err as HttpError;
    res.status(httpErr.statusCode).json({ message: httpErr.message });
  } else {
    console.error('Erro inesperado:', err);
    res.status(500).json({ message: 'Something broke!' });
  }
}
