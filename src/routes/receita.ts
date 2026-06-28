import { Router, Request, Response, NextFunction } from 'express';
import * as ReceitaController from '@/controllers/ReceitaController.js';
import { autenticar } from '@/middlewares/auth.js';
import { HttpError } from '@/errors/index.js';

const router = Router();

// List all receitas
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receitas = await ReceitaController.listarReceitas();
    res.json(receitas);
  } catch (error) {
    next(new HttpError('Unable to read receitas', 400));
  }
});

// Get receita by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const receita = await ReceitaController.obterReceita(id);
    res.json(receita);
  } catch (error) {
    next(new HttpError((error as Error).message, 404));
  }
});

// Get receitas from logged chef
router.get('/chef/minhas', autenticar('CHEF'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receitas = await ReceitaController.obterReceitasUsuario(req.usuario!.id)
    res.json(receitas);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

// Create receita
router.post('/', autenticar('CHEF'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdReceita = await ReceitaController.criarReceita({ ...req.body, usuario_id: req.usuario!.id });
    res.status(201).json(createdReceita);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

// Update receita
router.put('/:id', autenticar('CHEF'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updatedReceita = await ReceitaController.atualizarReceita({ ...req.body, id, usuario_id: req.usuario!.id });
    res.json(updatedReceita);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

// Delete receita
router.delete('/:id', autenticar('CHEF'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await ReceitaController.deletarReceita(id, req.usuario!.id);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

export default router;
