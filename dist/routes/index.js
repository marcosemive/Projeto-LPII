import { Router } from 'express';
import authRouter from '@/routes/auth.js';
import receitaRouter from '@/routes/receita.js';
import etiquetaRouter from '@/routes/etiqueta.js';
import favoritoRouter from '@/routes/favorito.js';
import uploadRouter from '@/routes/upload.js';
const router = Router();
router.use('/auth', authRouter);
router.use('/receitas', receitaRouter);
router.use('/etiquetas', etiquetaRouter);
router.use('/favoritos', favoritoRouter);
router.use('/upload', uploadRouter);
export default router;
//# sourceMappingURL=index.js.map