import type { ChefCreateInput } from '@/types/Chef.d.ts';
export declare function cadastroChef(data: ChefCreateInput): Promise<{
    chef: import("@/types/Chef.d.ts").Chef;
    token: string;
}>;
export declare function loginChef(email: string, senha: string): Promise<{
    chef: {
        id: number;
        nome: string;
        email: string;
    };
    token: string;
}>;
//# sourceMappingURL=ChefController.d.ts.map