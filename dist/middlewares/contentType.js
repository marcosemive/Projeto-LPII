import { HttpError } from '@/errors/index.js';
export function validarContentType(req, res, next) {
    if (['POST', 'PUT'].includes(req.method)) {
        if (!req.is('application/json') && !req.is('multipart/form-data')) {
            throw new HttpError('Content-Type deve ser application/json', 400);
        }
    }
    next();
}
//# sourceMappingURL=contentType.js.map