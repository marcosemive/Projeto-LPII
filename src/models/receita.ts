import prisma from '@/database/prisma.js';
import Etiqueta from '@/models/etiqueta.js';
import Chef from '@/models/chef.js';
import type { Receita, ReceitaCreateInput, ReceitaUpdateInput } from '@/types/Receita.d.ts';
import type { Etiqueta as EtiquetaType } from '@/types/Etiqueta.d.ts';

async function vincularEtiquetas(receitaId: number, etiquetas: string | string[]): Promise<void> {
  const lista = Array.isArray(etiquetas) ? etiquetas : [etiquetas];

  await prisma.receitaEtiqueta.deleteMany({
    where: { receita_id: receitaId }
  });

  for (const nome of lista) {
    const etiquetaObj = await Etiqueta.readByNome(nome);
    if (!etiquetaObj) throw new Error(`Etiqueta "${nome}" não encontrada`);
    await prisma.receitaEtiqueta.create({
      data: {
        receita_id: receitaId,
        etiqueta_id: etiquetaObj.id
      }
    });
  }
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

    const receita = await prisma.receita.create({
      data: {
        img,
        title,
        time: String(time),
        servings: Number(servings),
        chef_id: resolvedChefId!,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps)
      }
    });

    await vincularEtiquetas(receita.id, tagsInput);

    return await readById(receita.id);
  } else {
    throw new Error('Todos os campos são obrigatórios');
  }
}

async function read(): Promise<Receita[]> {
  const receitas = await prisma.receita.findMany({
    include: {
      chef: true,
      etiquetas: {
        include: { etiqueta: true }
      }
    }
  });

  return receitas.map(r => ({
    id: r.id,
    img: r.img,
    title: r.title,
    time: r.time,
    servings: r.servings,
    chef_id: r.chef_id,
    chef_nome: r.chef.nome,
    etiquetas: r.etiquetas.map(re => ({ id: re.etiqueta.id, nome: re.etiqueta.nome })),
    ingredients: JSON.parse(r.ingredients),
    steps: JSON.parse(r.steps)
  }));
}

async function readById(id: number): Promise<Receita> {
  const receita = await prisma.receita.findUnique({
    where: { id },
    include: {
      chef: true,
      etiquetas: {
        include: { etiqueta: true }
      }
    }
  });

  if (!receita) throw new Error('Receita não encontrada');

  return {
    id: receita.id,
    img: receita.img,
    title: receita.title,
    time: receita.time,
    servings: receita.servings,
    chef_id: receita.chef_id,
    chef_nome: receita.chef.nome,
    etiquetas: receita.etiquetas.map(re => ({ id: re.etiqueta.id, nome: re.etiqueta.nome })),
    ingredients: JSON.parse(receita.ingredients),
    steps: JSON.parse(receita.steps)
  };
}

async function readByChef(chef_id: number): Promise<Receita[]> {
  const receitas = await prisma.receita.findMany({
    where: { chef_id },
    include: {
      chef: true,
      etiquetas: {
        include: { etiqueta: true }
      }
    }
  });

  return receitas.map(r => ({
    id: r.id,
    img: r.img,
    title: r.title,
    time: r.time,
    servings: r.servings,
    chef_id: r.chef_id,
    chef_nome: r.chef.nome,
    etiquetas: r.etiquetas.map(re => ({ id: re.etiqueta.id, nome: re.etiqueta.nome })),
    ingredients: JSON.parse(r.ingredients),
    steps: JSON.parse(r.steps)
  }));
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
        time: String(time),
        servings: Number(servings),
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps)
      }
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
