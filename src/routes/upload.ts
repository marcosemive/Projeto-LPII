import { Router, Request, Response, NextFunction } from 'express';
import * as UploadController from '@/controllers/UploadController.js';
import { autenticarChef } from '@/middlewares/auth.js';
import { upload } from '@/utils/upload.js';
import { HttpError } from '@/errors/index.js';

const router = Router();

router.post('/', autenticarChef, upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const result = await UploadController.fazerUpload(file!);
    res.json(result);
  } catch (error) {
    next(new HttpError((error as Error).message, 400));
  }
});

export default router;
