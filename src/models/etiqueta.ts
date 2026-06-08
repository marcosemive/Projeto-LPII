import prisma from '@/database/prisma.js';
import type { Etiqueta, EtiquetaCreateInput } from '@/types/Etiqueta.d.ts';

async function create(data: EtiquetaCreateInput): Promise<Etiqueta> {
  const { nome } = data;

  if (nome) {
    const etiqueta = await prisma.etiqueta.create({
      data: { nome }
    });
    return { id: etiqueta.id, nome: etiqueta.nome };
  } else {
    throw new Error('Nome da etiqueta é obrigatório');
  }
}

async function read(): Promise<Etiqueta[]> {
  const etiquetas = await prisma.etiqueta.findMany({
    select: { id: true, nome: true }
  });
  return etiquetas;
}

async function readById(id: number): Promise<Etiqueta> {
  const etiqueta = await prisma.etiqueta.findUnique({
    where: { id },
    select: { id: true, nome: true }
  });
  if (etiqueta) {
    return etiqueta;
  } else {
    throw new Error('Etiqueta não encontrada');
  }
}

async function readByNome(nome: string): Promise<Etiqueta | undefined> {
  const etiqueta = await prisma.etiqueta.findUnique({
    where: { nome },
    select: { id: true, nome: true }
  });
  return etiqueta ?? undefined;
}

export default { create, read, readById, readByNome };
