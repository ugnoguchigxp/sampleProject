import { promises as fs } from 'fs';
import path from 'path';

interface TableInfo {
  tableGroup: string;
  candidates: string[];
}

const REPORT = path.resolve('table_similarity_report.json');
const DDL_DIR = path.resolve('ddl_sources');
const OUT_FILE = path.resolve('unified_ddl.sql');

function parseColumns(sql: string): Record<string, string> {
  const cols: Record<string, string> = {};
  const regex = /"?(\w+)"?\s+([\w()]+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    cols[match[1]] = match[2];
  }
  return cols;
}

async function loadTableDDL(name: string): Promise<Record<string, string>> {
  const file = path.join(DDL_DIR, name + '.sql');
  try {
    const ddl = await fs.readFile(file, 'utf8');
    return parseColumns(ddl);
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return {};
  }
}

async function generate(): Promise<void> {
  const report: TableInfo[] = JSON.parse(await fs.readFile(REPORT, 'utf8'));
  const lines: string[] = [];
  for (const group of report) {
    const columns: Record<string, string> = {};
    for (const cand of group.candidates) {
      const cols = await loadTableDDL(cand);
      Object.entries(cols).forEach(([name, type]) => {
        if (!columns[name]) {
          columns[name] = type;
        }
      });
    }
    const columnDefs = Object.entries(columns)
      .map(([name, type]) => `  "${name}" ${type}`)
      .join(',\n');
    lines.push(`CREATE TABLE \"${group.tableGroup}\" (\n${columnDefs}\n);`);
  }
  await fs.writeFile(OUT_FILE, lines.join('\n\n'));
}

generate().catch(err => {
  console.error('Failed to generate unified ddl:', err);
});
