import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload, UsuarioRole } from '@/types/Auth.d.ts';

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error('JWT_SECRET não definido no .env');

function normalizarRole(role?: string, tipo?: 'chef' | 'usuario'): UsuarioRole {
  if (role === 'CHEF' || role === 'ENTUSIASTA') return role;
  if (tipo === 'chef') return 'CHEF';
  if (tipo === 'usuario') return 'ENTUSIASTA';
  return 'ENTUSIASTA';
}

export function gerarToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

declare global {
  namespace Express {
    interface Request {
      usuario?: AuthPayload;
    }
  }
}

export function autenticar(requiredRoles: UsuarioRole | UsuarioRole[]) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, SECRET) as AuthPayload;
      const role = normalizarRole(decoded.role, decoded.tipo);
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!roles.includes(role)) {
        const label = role === 'CHEF' ? 'chefs' : 'usuários';
        return res.status(403).json({ message: `Acesso restrito a ${label}` });
      }

      req.usuario = { ...decoded, role };
      next();
    } catch {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  };
}