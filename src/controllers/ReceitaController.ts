import Receita from '@/models/receita.js';
import type { ReceitaCreateInput, ReceitaUpdateInput } from '@/types/Receita.d.ts';

export async function listarReceitas() {
  return await Receita.read();
}

export async function obterReceita(id: number) {
  return await Receita.readById(id);
}

export async function obterReceitasChef(chefId: number) {
  return await Receita.readByChef(chefId);
}

export async function criarReceita(data: ReceitaCreateInput) {
  return await Receita.create(data);
}

export async function atualizarReceita(data: ReceitaUpdateInput) {
  return await Receita.update(data);
}

export async function deletarReceita(id: number, chefId: number) {
  return await Receita.remove(id, chefId);
}
