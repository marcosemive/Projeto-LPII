import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from '@/types/Auth.d.ts';
export declare function gerarToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string;
declare global {
    namespace Express {
        interface Request {
            chef?: AuthPayload;
            usuario?: AuthPayload;
        }
    }
}
export declare function autenticarChef(req: Request, res: Response, next: NextFunction): Response | void;
export declare function autenticarUsuario(req: Request, res: Response, next: NextFunction): Response | void;
//# sourceMappingURL=auth.d.ts.map