// One shared database connection. Every file imports `prisma` from here.
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// "12" -> 12. Anything that is not a whole number becomes 0 (no row has id 0), so a wrong id in the URL gives "not found" and not a crash.
export const toId = (value) => (Number.isInteger(Number(value)) && value !== '' && value !== null ? Number(value) : 0);