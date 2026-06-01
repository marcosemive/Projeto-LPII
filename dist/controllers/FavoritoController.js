import Favorito from '@/models/favorito.js';
export async function listarFavoritos(usuarioId) {
    return await Favorito.readByUsuario(usuarioId);
}
export async function adicionarFavorito(usuarioId, receitaId) {
    return await Favorito.add(usuarioId, receitaId);
}
export async function removerFavorito(usuarioId, receitaId) {
    return await Favorito.remove(usuarioId, receitaId);
}
//# sourceMappingURL=FavoritoController.js.map