import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@/errors/index.js';

export function validarContentType(req: Request, res: Response, next: NextFunction): void {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new HttpError('Content-Type deve ser application/json', 400);
    }
  }
  next();
}
