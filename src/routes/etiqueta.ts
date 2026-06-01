import { Router, Request, Response, NextFunction } from 'express';
import * as EtiquetaController from '@/controllers/EtiquetaController.js';
import { HttpError } from '@/errors/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const etiquetas = await EtiquetaController.listarEtiquetas();
    res.json(etiquetas);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

export default router;
