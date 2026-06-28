import type { Usuario } from '@/types/Usuario.d.ts';

export type UsuarioRole = 'CHEF' | 'ENTUSIASTA';

export interface AuthPayload {
  id: number;
  nome: string;
  role: UsuarioRole;
  tipo?: 'chef' | 'usuario';
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  chef?: Usuario;
  usuario?: Usuario;
  token: string;
}

export interface RequestUser {
  chef?: AuthPayload;
  usuario?: AuthPayload;
}
