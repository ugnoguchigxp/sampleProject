import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('dump_sources');
const DEST_DIR = path.resolve('ddl_sources');

async function extractDDL(): Promise<void> {
  await fs.mkdir(DEST_DIR, { recursive: true });
  const files = await fs.readdir(SRC_DIR);

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    try {
      const content = await fs.readFile(srcPath, 'utf8');
      const matches = content.match(/CREATE\s+TABLE[\s\S]+?;/gi);
      if (matches) {
        const destPath = path.join(DEST_DIR, file);
        await fs.writeFile(destPath, matches.join('\n'));
      } else {
        console.warn(`DDL not found in ${file}`);
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

extractDDL().catch(err => {
  console.error('Extraction failed:', err);
});
