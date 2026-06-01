import { Router } from 'express';
import * as UploadController from '@/controllers/UploadController.js';
import { autenticarChef } from '@/middlewares/auth.js';
import { upload } from '@/utils/upload.js';
import { HttpError } from '@/errors/index.js';
const router = Router();
router.post('/', autenticarChef, upload.single('img'), async (req, res, next) => {
    try {
        const file = req.file;
        const result = await UploadController.fazerUpload(file);
        res.json(result);
    }
    catch (error) {
        next(new HttpError(error.message, 400));
    }
});
export default router;
//# sourceMappingURL=upload.js.map