export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
}

export interface UsuarioCreateInput {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioUpdateInput {
  id: number;
  nome: string;
  email: string;
}
