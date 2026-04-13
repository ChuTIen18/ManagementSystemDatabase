const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copySchema() {
  const source = path.resolve(__dirname, '../src/database/schemas/schema.sql');
  const targetDir = path.resolve(__dirname, '../dist/database/schemas');
  const target = path.join(targetDir, 'schema.sql');

  if (!fs.existsSync(source)) {
    console.error(`Schema source not found: ${source}`);
    process.exit(1);
  }

  ensureDir(targetDir);
  fs.copyFileSync(source, target);
  console.log(`✓ Copied schema.sql to ${target}`);
}

copySchema();

