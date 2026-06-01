import type { UsuarioCreateInput } from '@/types/Usuario.d.ts';
export declare function cadastroUsuario(data: UsuarioCreateInput): Promise<{
    usuario: import("@/types/Usuario.d.ts").Usuario;
    token: string;
}>;
export declare function loginUsuario(email: string, senha: string): Promise<{
    usuario: {
        id: number;
        nome: string;
        email: string;
    };
    token: string;
}>;
//# sourceMappingURL=UsuarioController.d.ts.map