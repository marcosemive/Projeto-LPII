import type { Chef, ChefCreateInput, ChefUpdateInput } from '@/types/Chef.d.ts';
declare function create(data: ChefCreateInput): Promise<Chef>;
declare function read(): Promise<Chef[]>;
declare function readById(id: number): Promise<Chef>;
declare function readByEmail(email: string): Promise<(Chef & {
    senha: string;
}) | undefined>;
declare function update(data: ChefUpdateInput): Promise<Chef>;
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
//# sourceMappingURL=chef.d.ts.map