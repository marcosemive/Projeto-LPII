import { Router } from 'express';
import * as EtiquetaController from '@/controllers/EtiquetaController.js';
import { HttpError } from '@/errors/index.js';
const router = Router();
router.get('/', async (req, res, next) => {
    try {
        const etiquetas = await EtiquetaController.listarEtiquetas();
        res.json(etiquetas);
    }
    catch (error) {
        next(new HttpError(error.message, 400));
    }
});
export default router;
//# sourceMappingURL=etiqueta.js.map