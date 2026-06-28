import { prisma } from '@/database/prisma.js';
import Etiqueta from '@/models/etiqueta.js';
import Usuario from '@/models/usuario.js';
import type { Receita, ReceitaCreateInput, ReceitaUpdateInput } from '@/types/Receita.d.ts';

async function vincularEtiquetas(receitaId: number, etiquetas: string | string[]): Promise<void> {
  const lista = Array.isArray(etiquetas) ? etiquetas : [etiquetas];

  await prisma.receitaEtiqueta.deleteMany({ where: { receita_id: receitaId } });

  const etiquetaIds: number[] = [];
  for (const nome of lista) {
    const etiquetaObj = await Etiqueta.readByNome(nome);
    if (!etiquetaObj) throw new Error(`Etiqueta "${nome}" não encontrada`);
    etiquetaIds.push(etiquetaObj.id);
  }

  await prisma.receitaEtiqueta.createMany({
    data: etiquetaIds.map((etiqueta_id) => ({ receita_id: receitaId, etiqueta_id })),
  });
}

function montarReceita(row: any): Receita {
  return {
    id: row.id,
    img: row.img,
    title: row.title,
    time: row.time,         // Int — ex: 30
    servings: row.servings, // Int — ex: 4
    usuario_id: row.usuario.id,
    usuario_nome: row.usuario.nome,
    etiquetas: row.etiquetas.map((re: any) => re.etiqueta),
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  };
}

async function create(data: ReceitaCreateInput): Promise<Receita> {
  const { img, etiqueta, etiquetas, title, time, servings, usuario_email, usuario_id, ingredients, steps } = data;

  const tagsInput = etiquetas || etiqueta;

  let resolvedUsuarioId = usuario_id;
  if (!resolvedUsuarioId && usuario_email) {
    const usuario = await Usuario.readByEmail(usuario_email);
    if (usuario) resolvedUsuarioId = usuario.id;
  }

  if (img && tagsInput && title && time && servings && ingredients && steps && resolvedUsuarioId) {
    if (title.trim() === 'Nome da Receita') {
      throw new Error('Por favor, altere o nome da receita');
    }

    const nova = await prisma.receita.create({
      data: {
        img,
        title,
        time: Math.floor(Number(time)),         // salva como inteiro: 30
        servings: Math.floor(Number(servings)), // salva como inteiro: 4
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        usuario: {
          connect: { id: Number(resolvedUsuarioId) },
        },
      },
    });

    await vincularEtiquetas(nova.id, tagsInput);

    return await readById(nova.id);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Receita[]> {
  const rows = await prisma.receita.findMany({
    include: {
      usuario: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  return rows.map(montarReceita);
}

async function readById(id: number): Promise<Receita> {
  const row = await prisma.receita.findUnique({
    where: { id },
    include: {
      usuario: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  if (!row) throw new Error('Receita não encontrada');

  return montarReceita(row);
}

async function readByUsuario(usuario_id: number): Promise<Receita[]> {
  const rows = await prisma.receita.findMany({
    where: { usuario_id },
    include: {
      usuario: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  return rows.map(montarReceita);
}

async function update(data: ReceitaUpdateInput): Promise<Receita> {
  const { id, img, etiqueta, etiquetas, title, time, servings, ingredients, steps, usuario_id } = data;

  const tagsInput = etiquetas || etiqueta;
  const ownerId = usuario_id;

  if (id && img && tagsInput && title && time && servings && ingredients && steps) {
    const atual = await prisma.receita.findUnique({ where: { id } });
    if (!atual) throw new Error('Receita não encontrada');
    if (ownerId && atual.usuario_id !== ownerId) throw new Error('Sem permissão para editar esta receita');

    await prisma.receita.update({
      where: { id },
      data: {
        img,
        title,
        time: Math.floor(Number(time)),         // salva como inteiro: 30
        servings: Math.floor(Number(servings)), // salva como inteiro: 4
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
      },
    });

    await vincularEtiquetas(id, tagsInput);

    return await readById(id);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function remove(id: number, usuario_id?: number): Promise<boolean> {
  const atual = await prisma.receita.findUnique({ where: { id } });
  if (!atual) throw new Error('Receita não encontrada');
  if (usuario_id && atual.usuario_id !== usuario_id) throw new Error('Sem permissão para deletar esta receita');

  await prisma.receita.delete({ where: { id } });
  return true;
}

export default { create, read, readById, readByUsuario, update, remove };