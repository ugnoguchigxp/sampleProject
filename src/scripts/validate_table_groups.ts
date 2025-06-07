import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const FILE = path.resolve('table_similarity_report.json');

const schema = z.array(
  z.object({
    tableGroup: z.string(),
    candidates: z.array(z.string()).min(1),
    similarity: z.number().min(0).max(1),
  })
);

async function validate(): Promise<void> {
  try {
    const json = await fs.readFile(FILE, 'utf8');
    const data = JSON.parse(json);
    schema.parse(data);
    console.log('table_similarity_report.json is valid');
  } catch (err) {
    console.error('Invalid report:', err);
    process.exitCode = 1;
  }
}

validate();
