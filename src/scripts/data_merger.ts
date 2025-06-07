import { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';

export type SourceMeta = {
  source_table: string;
  original_pk: string | number;
};

const prisma = new PrismaClient();

export async function mergeData<T extends { id?: unknown; source?: SourceMeta }>(
  table: keyof PrismaClient,
  records: T[],
  keyFields: Array<keyof T>
): Promise<void> {
  const fuse = new Fuse(records, { keys: keyFields as string[] });

  for (const record of records) {
    const result = fuse.search(record as Record<string, unknown>)[0];
    if (result && result.item !== record && result.score && result.score < 0.2) {
      await (prisma[table] as any).update({
        where: { id: (result.item as any).id },
        data: { ...record, source: record.source },
      });
    } else {
      await (prisma[table] as any).create({ data: record });
    }
  }
}
