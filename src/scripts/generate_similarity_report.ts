import { promises as fs } from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

interface TableSchema {
  file: string;
  name: string;
  columns: string[];
}

const DDL_DIR = path.resolve('ddl_sources');
const OUT_FILE = path.resolve('table_similarity_report.json');

function parseTables(sql: string, file: string): TableSchema[] {
  const tableRegex = /CREATE\s+TABLE\s+"?(\w+)"?\s*\(([^;]+)\);/gi;
  const tables: TableSchema[] = [];
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(sql)) !== null) {
    const [, name, cols] = match;
    const columns = cols
      .split(/,\n/)
      .map(c => c.trim().split(/\s+/)[0].replace(/["`]/g, ''));
    tables.push({ file, name, columns });
  }
  return tables;
}

async function buildSchemas(): Promise<TableSchema[]> {
  const files = await fs.readdir(DDL_DIR);
  const schemas: TableSchema[] = [];
  for (const file of files) {
    try {
      const sql = await fs.readFile(path.join(DDL_DIR, file), 'utf8');
      schemas.push(...parseTables(sql, file));
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }
  return schemas;
}

async function generate(): Promise<void> {
  const schemas = await buildSchemas();
  const fuse = new Fuse(schemas, {
    keys: ['name', 'columns'],
    includeScore: true,
    threshold: 0.4,
  });
  const report: Array<{ tableGroup: string; candidates: string[]; similarity: number }> = [];

  for (const schema of schemas) {
    const results = fuse.search({ name: schema.name, columns: schema.columns });
    const candidates = results
      .filter(r => r.item.name !== schema.name)
      .slice(0, 3)
      .map(r => ({ name: r.item.name, score: r.score ?? 0 }));
    if (candidates.length) {
      const best = candidates[0];
      report.push({
        tableGroup: schema.name,
        candidates: [schema.name, best.name],
        similarity: 1 - best.score,
      });
    }
  }
  await fs.writeFile(OUT_FILE, JSON.stringify(report, null, 2));
}

generate().catch(err => {
  console.error('Failed to generate similarity report:', err);
});
