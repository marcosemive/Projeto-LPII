import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@/errors/index.js';
export declare function errorHandler(err: HttpError | Error, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map