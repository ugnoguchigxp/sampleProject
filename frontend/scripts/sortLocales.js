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

sortLocales();
