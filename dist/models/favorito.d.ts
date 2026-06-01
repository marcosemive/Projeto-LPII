import type { Receita as ReceitaType } from '@/types/Receita.d.ts';
import type { Favorito } from '@/types/Favorito.d.ts';
declare function add(usuario_id: number, receita_id: number): Promise<Favorito>;
declare function remove(usuario_id: number, receita_id: number): Promise<boolean>;
declare function readByUsuario(usuario_id: number): Promise<ReceitaType[]>;
declare const _default: {
    add: typeof add;
    remove: typeof remove;
    readByUsuario: typeof readByUsuario;
};
export default _default;
//# sourceMappingURL=favorito.d.ts.map