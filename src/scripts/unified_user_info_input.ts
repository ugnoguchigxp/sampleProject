import { promises as fs } from 'fs';
import { mergeData, SourceMeta } from './data_merger';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parse/sync';

const prisma = new PrismaClient();

async function run(): Promise<void> {
  const csvData = await fs.readFile('user_info.csv', 'utf8');
  const records = csv.parse(csvData, { columns: true });
  const formatted = records.map((r: any) => ({
    ...r,
    source: { source_table: 'user_info', original_pk: r.id } as SourceMeta,
  }));
  await mergeData('userInfo' as any, formatted, ['email']);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
