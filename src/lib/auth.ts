import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");
  const passwordHash = await hash(password, 12);
  return prisma.user.create({ data: { email, passwordHash, name } });
}

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await compare(password, user.passwordHash);
  return ok ? user : null;
}
