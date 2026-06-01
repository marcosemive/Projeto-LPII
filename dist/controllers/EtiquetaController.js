import Etiqueta from '@/models/etiqueta.js';
export async function listarEtiquetas() {
    return await Etiqueta.read();
}
//# sourceMappingURL=EtiquetaController.js.map