import { Router, Request, Response, NextFunction } from 'express';
import * as FavoritoController from '@/controllers/FavoritoController.js';
import { autenticar } from '@/middlewares/auth.js';
import { HttpError } from '@/errors/index.js';

const router = Router();

// Get user favoritos
router.get('/', autenticar('ENTUSIASTA'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receitas = await FavoritoController.listarFavoritos(req.usuario!.id);
    res.json(receitas);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

// Add favorito
router.post('/:receita_id', autenticar('ENTUSIASTA'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receita_id = Number(req.params.receita_id);
    const favorito = await FavoritoController.adicionarFavorito(req.usuario!.id, receita_id);
    res.status(201).json(favorito);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

// Remove favorito
router.delete('/:receita_id', autenticar('ENTUSIASTA'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receita_id = Number(req.params.receita_id);
    await FavoritoController.removerFavorito(req.usuario!.id, receita_id);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

export default router;
