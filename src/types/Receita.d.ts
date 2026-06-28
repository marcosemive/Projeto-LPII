import type { Etiqueta } from '@/types/Etiqueta.d.ts';

export interface Receita {
  id: number;
  img: string;
  title: string;
  time: number | string;
  servings: number | string;
  ingredients: string | string[];
  steps: string | string[];
  usuario_id: number;
  usuario_nome: string;
  etiquetas: Etiqueta[];
}

export interface ReceitaCreateInput {
  img: string;
  etiqueta?: string | string[];
  etiquetas?: string | string[];
  title: string;
  time: number | string;
  servings: number | string;
  usuario_email?: string;
  usuario_id?: number;
  ingredients: string | string[];
  steps: string | string[];
}

export interface ReceitaUpdateInput extends ReceitaCreateInput {
  id: number;
  usuario_id?: number;
}
