export declare function listarFavoritos(usuarioId: number): Promise<import("../types/Receita").Receita[]>;
export declare function adicionarFavorito(usuarioId: number, receitaId: number): Promise<import("../types/Favorito").Favorito>;
export declare function removerFavorito(usuarioId: number, receitaId: number): Promise<boolean>;
//# sourceMappingURL=FavoritoController.d.ts.map