import type { Chef } from '@/types/Chef.d.ts';
import type { Usuario } from '@/types/Usuario.d.ts';

export interface AuthPayload {
  id: number;
  nome: string;
  tipo: 'chef' | 'usuario';
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  chef?: Chef;
  usuario?: Usuario;
  token: string;
}

export interface RequestUser {
  chef?: AuthPayload;
  usuario?: AuthPayload;
}
