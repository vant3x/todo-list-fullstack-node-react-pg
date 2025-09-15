import { PrismaClient } from '@prisma/client';

// Se crea una única instancia de PrismaClient.
// Esto previene que se creen múltiples conexiones a la base de datos
// desde diferentes partes de la aplicación.
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
