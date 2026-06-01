export interface Chef {
  id: number;
  nome: string;
  email: string;
  senha?: string;
}

export interface ChefCreateInput {
  nome: string;
  email: string;
  senha: string;
}

export interface ChefUpdateInput {
  id: number;
  nome: string;
  email: string;
}
