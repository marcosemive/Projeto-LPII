import type { Etiqueta, EtiquetaCreateInput } from '@/types/Etiqueta.d.ts';
declare function create(data: EtiquetaCreateInput): Promise<Etiqueta>;
declare function read(): Promise<Etiqueta[]>;
declare function readById(id: number): Promise<Etiqueta>;
declare function readByNome(nome: string): Promise<Etiqueta | undefined>;
declare const _default: {
    create: typeof create;
    read: typeof read;
    readById: typeof readById;
    readByNome: typeof readByNome;
};
export default _default;
//# sourceMappingURL=etiqueta.d.ts.map