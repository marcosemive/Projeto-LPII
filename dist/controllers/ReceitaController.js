import Receita from '@/models/receita.js';
export async function listarReceitas() {
    return await Receita.read();
}
export async function obterReceita(id) {
    return await Receita.readById(id);
}
export async function obterReceitasChef(chefId) {
    return await Receita.readByChef(chefId);
}
export async function criarReceita(data) {
    return await Receita.create(data);
}
export async function atualizarReceita(data) {
    return await Receita.update(data);
}
export async function deletarReceita(id, chefId) {
    return await Receita.remove(id, chefId);
}
//# sourceMappingURL=ReceitaController.js.map