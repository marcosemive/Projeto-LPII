import Favorito from '@/models/favorito.js';

export async function listarFavoritos(usuarioId: number) {
  return await Favorito.readByUsuario(usuarioId);
}

export async function adicionarFavorito(usuarioId: number, receitaId: number) {
  return await Favorito.add(usuarioId, receitaId);
}

export async function removerFavorito(usuarioId: number, receitaId: number) {
  return await Favorito.remove(usuarioId, receitaId);
}
