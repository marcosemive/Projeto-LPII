import type { Chef } from '@/types/Chef.d.ts';
import type { Etiqueta } from '@/types/Etiqueta.d.ts';

export interface Receita {
  id: number;
  img: string;
  title: string;
  time: number | string;
  servings: number | string;
  ingredients: string | string[];
  steps: string | string[];
  chef_id: number;
  chef_nome: string;
  etiquetas: Etiqueta[];
}

export interface ReceitaCreateInput {
  img: string;
  etiqueta?: string | string[];
  etiquetas?: string | string[];
  title: string;
  time: number | string;
  servings: number | string;
  chef_email?: string;
  chef_id?: number;
  ingredients: string | string[];
  steps: string | string[];
}

export interface ReceitaUpdateInput extends ReceitaCreateInput {
  id: number;
  chef_id: number;
}
