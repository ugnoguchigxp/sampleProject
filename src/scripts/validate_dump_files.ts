import { promises as fs } from 'fs';
import path from 'path';

const DUMP_DIR = path.resolve('db_dumps');
const pattern = /^[^_]+__[^_]+\.sql$/;

async function validate(): Promise<void> {
  const files = await fs.readdir(DUMP_DIR);
  const invalid = files.filter(f => !pattern.test(f));
  if (invalid.length) {
    console.error('Invalid dump files:', invalid.join(', '));
    process.exitCode = 1;
  } else {
    console.log('All dump files valid');
  }
}

validate().catch(err => {
  console.error('Validation failed:', err);
});
