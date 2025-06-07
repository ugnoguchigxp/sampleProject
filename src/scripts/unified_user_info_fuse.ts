import { mergeData } from './data_merger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run(): Promise<void> {
  // TODO: Load data from db_dumps and parse into records
  const records: Array<{ id?: number; name: string; source: { source_table: string; original_pk: number } }> = [];
  await mergeData('userInfo' as any, records, ['name']);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
