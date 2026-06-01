import type { Usuario, UsuarioCreateInput, UsuarioUpdateInput } from '@/types/Usuario.d.ts';
declare function create(data: UsuarioCreateInput): Promise<Usuario>;
declare function read(): Promise<Usuario[]>;
declare function readById(id: number): Promise<Usuario>;
declare function readByEmail(email: string): Promise<(Usuario & {
    senha: string;
}) | undefined>;
declare function update(data: UsuarioUpdateInput): Promise<Usuario>;
declare function remove(id: number): Promise<boolean>;
declare const _default: {
    create: typeof create;
    read: typeof read;
    readById: typeof readById;
    readByEmail: typeof readByEmail;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
//# sourceMappingURL=usuario.d.ts.map