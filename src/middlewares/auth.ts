import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from '@/types/Auth.d.ts';

const SECRET = 'receitoteca_secret_2026';

export function gerarToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

declare global {
  namespace Express {
    interface Request {
      chef?: AuthPayload;
      usuario?: AuthPayload;
    }
  }
}

export function autenticarChef(req: Request, res: Response, next: NextFunction): Response | void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as AuthPayload;
    if (decoded.tipo !== 'chef') {
      return res.status(403).json({ message: 'Acesso restrito a chefs' });
    }
    req.chef = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export function autenticarUsuario(req: Request, res: Response, next: NextFunction): Response | void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as AuthPayload;
    if (decoded.tipo !== 'usuario') {
      return res.status(403).json({ message: 'Acesso restrito a usuários' });
    }
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
