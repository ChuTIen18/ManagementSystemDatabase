const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const directories = [
    "src/main",
    "src/renderer/components",
    "src/renderer/pages",
    "src/renderer/styles",
    "src/renderer/hooks",
    "src/renderer/store",
    "src/renderer/utils",
    "src/preload",
    "src/api/controllers",
    "src/api/models",
    "src/api/routes",
    "src/api/middleware",
    "src/api/config",
    "src/api/services",
    "src/api/utils",
    "src/database/migrations",
    "src/database/seeders",
    "src/database/schemas",
    "src/shared/types",
    "src/shared/constants",
    "src/shared/utils",
    "public/assets/images",
    "public/assets/icons",
    "public/assets/fonts",
    "tests/unit",
    "tests/integration",
    "tests/e2e",
    "scripts",
    "config",
    "logs",
];

directories.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
    console.log(`Created: ${dir}`);
});

console.log(`\n✓ Created ${directories.length} directories successfully!`);
