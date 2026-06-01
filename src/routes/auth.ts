import { Router, Request, Response, NextFunction } from 'express';
import * as ChefController from '@/controllers/ChefController.js';
import * as UsuarioController from '@/controllers/UsuarioController.js';
import { HttpError } from '@/errors/index.js';

const router = Router();

// Chef Routes
router.post('/chef/cadastro', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ChefController.cadastroChef(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

router.post('/chef/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const result = await ChefController.loginChef(email, senha);
    res.json(result);
  } catch (error) {
    next(new HttpError((error as Error).message, 401));
  }
});

// Usuario Routes
router.post('/usuario/cadastro', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UsuarioController.cadastroUsuario(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

router.post('/usuario/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const result = await UsuarioController.loginUsuario(email, senha);
    res.json(result);
  } catch (error) {
    next(new HttpError((error as Error).message, 401));
  }
});

export default router;
