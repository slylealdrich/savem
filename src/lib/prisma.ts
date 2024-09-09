import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export type EntryWithTag = Prisma.EntryGetPayload<{
  include: { tag: true };
}>;
