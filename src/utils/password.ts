import argon2 from "argon2";

export function validarForcaSenha(senha: string): void {
  const erros: string[] = [];

  if (senha.length < 6) erros.push('mínimo de 6 caracteres');
  if (!/[0-9]/.test(senha)) erros.push('ao menos 1 dígito');
  if (!/[a-z]/.test(senha)) erros.push('ao menos 1 letra minúscula');
  if (!/[A-Z]/.test(senha)) erros.push('ao menos 1 letra maiúscula');
  if (!/[!@#$]/.test(senha)) erros.push('ao menos 1 caractere especial (! @ # $)');

  if (erros.length > 0) {
    throw new Error(`Senha inválida: requer ${erros.join(', ')}`);
  }
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}