import type { Receita, ReceitaCreateInput, ReceitaUpdateInput } from '@/types/Receita.d.ts';
declare function create(data: ReceitaCreateInput): Promise<Receita>;
declare function read(): Promise<Receita[]>;
declare function readById(id: number): Promise<Receita>;
declare function readByChef(chef_id: number): Promise<Receita[]>;
declare function update(data: ReceitaUpdateInput): Promise<Receita>;
declare function remove(id: number, chef_id?: number): Promise<boolean>;
declare const _default: {
    create: typeof create;
    read: typeof read;
    readById: typeof readById;
    readByChef: typeof readByChef;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
//# sourceMappingURL=receita.d.ts.map