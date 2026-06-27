import { prisma } from '@/database/prisma.js';
import Etiqueta from '@/models/etiqueta.js';
import Chef from '@/models/chef.js';
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
    time: row.time,
    servings: row.servings,
    chef_id: row.chef.id,
    chef_nome: row.chef.nome,
    etiquetas: row.etiquetas.map((re: any) => re.etiqueta),
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  };
}

async function create(data: ReceitaCreateInput): Promise<Receita> {
  const { img, etiqueta, etiquetas, title, time, servings, chef_email, chef_id, ingredients, steps } = data;

  const tagsInput = etiquetas || etiqueta;

  if (img && tagsInput && title && time && servings && ingredients && steps) {
    if (title.trim() === 'Nome da Receita') {
      throw new Error('Por favor, altere o nome da receita');
    }

    let resolvedChefId = chef_id;
    if (!resolvedChefId && chef_email) {
      const chef = await Chef.readByEmail(chef_email);
      if (!chef) throw new Error('Chef não encontrado');
      resolvedChefId = chef.id;
    }

    const nova = await prisma.receita.create({
      data: {
        img,
        title,
        time: Number(time),
        servings: Number(servings),
        chef_id: resolvedChefId!,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
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
      chef: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  return rows.map(montarReceita);
}

async function readById(id: number): Promise<Receita> {
  const row = await prisma.receita.findUnique({
    where: { id },
    include: {
      chef: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  if (!row) throw new Error('Receita não encontrada');

  return montarReceita(row);
}

async function readByChef(chef_id: number): Promise<Receita[]> {
  const rows = await prisma.receita.findMany({
    where: { chef_id },
    include: {
      chef: true,
      etiquetas: { include: { etiqueta: true } },
    },
  });

  return rows.map(montarReceita);
}

async function update(data: ReceitaUpdateInput): Promise<Receita> {
  const { id, img, etiqueta, etiquetas, title, time, servings, ingredients, steps, chef_id } = data;

  const tagsInput = etiquetas || etiqueta;

  if (id && img && tagsInput && title && time && servings && ingredients && steps) {
    const atual = await prisma.receita.findUnique({ where: { id } });
    if (!atual) throw new Error('Receita não encontrada');
    if (chef_id && atual.chef_id !== chef_id) throw new Error('Sem permissão para editar esta receita');

    await prisma.receita.update({
      where: { id },
      data: {
        img,
        title,
        time: Number(time),
        servings: Number(servings),
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

async function remove(id: number, chef_id?: number): Promise<boolean> {
  const atual = await prisma.receita.findUnique({ where: { id } });
  if (!atual) throw new Error('Receita não encontrada');
  if (chef_id && atual.chef_id !== chef_id) throw new Error('Sem permissão para deletar esta receita');

  await prisma.receita.delete({ where: { id } });
  return true;
}

export default { create, read, readById, readByChef, update, remove };