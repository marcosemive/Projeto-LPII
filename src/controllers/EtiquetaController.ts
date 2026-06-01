import Etiqueta from '@/models/etiqueta.js';

export async function listarEtiquetas() {
  return await Etiqueta.read();
}
