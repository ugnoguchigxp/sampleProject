import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../src/locales');

function sortKeysInFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonContent = JSON.parse(fileContent);

  const sortedContent = Object.keys(jsonContent)
    .sort()
    .reduce((acc, key) => {
      acc[key] = jsonContent[key];
      return acc;
    }, {});

  fs.writeFileSync(filePath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf-8');
  console.log(`Sorted keys in ${filePath}`);
}

function sortLocales() {
  const files = fs.readdirSync(localesDir);

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(localesDir, file);
      sortKeysInFile(filePath);
    }
  });
}

function sortObject(obj) {
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== 'object' || obj === null) return obj;
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObject(obj[key]);
  });
  return sorted;
}

function sortLocaleFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const sorted = sortObject(json);
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`Sorted: ${filePath}`);
}

function main() {
  const dir = path.join(__dirname, '../src/locales');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  files.forEach(f => sortLocaleFile(path.join(dir, f)));
}

if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`) {
  main();
}
