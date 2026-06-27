import { prisma } from '@/database/prisma.js';
import type { Etiqueta, EtiquetaCreateInput } from '@/types/Etiqueta.d.ts';

async function create(data: EtiquetaCreateInput): Promise<Etiqueta> {
  const { nome } = data;

  if (nome) {
    return await prisma.etiqueta.create({ data: { nome } });
  } else {
    throw new Error('Nome da etiqueta é obrigatório');
  }
}

async function read(): Promise<Etiqueta[]> {
  return await prisma.etiqueta.findMany();
}

async function readById(id: number): Promise<Etiqueta> {
  const etiqueta = await prisma.etiqueta.findUnique({ where: { id } });

  if (etiqueta) {
    return etiqueta;
  } else {
    throw new Error('Etiqueta não encontrada');
  }
}

async function readByNome(nome: string): Promise<Etiqueta | undefined> {
  const etiqueta = await prisma.etiqueta.findUnique({ where: { nome } });
  return etiqueta ?? undefined;
}

export default { create, read, readById, readByNome };