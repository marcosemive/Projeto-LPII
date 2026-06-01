import type { ReceitaCreateInput, ReceitaUpdateInput } from '@/types/Receita.d.ts';
export declare function listarReceitas(): Promise<import("@/types/Receita.d.ts").Receita[]>;
export declare function obterReceita(id: number): Promise<import("@/types/Receita.d.ts").Receita>;
export declare function obterReceitasChef(chefId: number): Promise<import("@/types/Receita.d.ts").Receita[]>;
export declare function criarReceita(data: ReceitaCreateInput): Promise<import("@/types/Receita.d.ts").Receita>;
export declare function atualizarReceita(data: ReceitaUpdateInput): Promise<import("@/types/Receita.d.ts").Receita>;
export declare function deletarReceita(id: number, chefId: number): Promise<boolean>;
//# sourceMappingURL=ReceitaController.d.ts.map