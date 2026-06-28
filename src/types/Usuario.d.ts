export type UsuarioRole = 'CHEF' | 'ENTUSIASTA';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  role?: UsuarioRole;
}

export interface UsuarioCreateInput {
  nome: string;
  email: string;
  senha: string;
  role?: UsuarioRole;
}

export interface UsuarioUpdateInput {
  id: number;
  nome: string;
  email: string;
  role?: UsuarioRole;
}
