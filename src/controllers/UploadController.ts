export async function fazerUpload(file: Express.Multer.File) {
  if (!file) {
    throw new Error('Nenhuma imagem enviada');
  }
  return { img: `images/${file.filename}` };
}
