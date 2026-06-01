export async function fazerUpload(file) {
    if (!file) {
        throw new Error('Nenhuma imagem enviada');
    }
    return { img: `images/${file.filename}` };
}
//# sourceMappingURL=UploadController.js.map