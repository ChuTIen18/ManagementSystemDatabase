const fs = require('fs');
const path = require('path');

console.log('📦 Creating subfolders and moving files...\n');

// Tạo các subfolder cần thiết
const folders = [
  'src/main',
  'src/preload',
  'src/renderer/components',
  'src/renderer/pages',
  'src/renderer/hooks',
  'src/renderer/store',
  'src/renderer/styles',
  'src/renderer/utils',
  'src/api/controllers',
  'src/api/models',
  'src/api/routes',
  'src/api/middleware',
  'src/api/config',
  'src/api/services',
  'src/api/utils',
  'src/database/migrations',
  'src/database/seeders',
  'src/database/schemas',
  'src/shared/types',
  'src/shared/constants',
  'src/shared/utils',
  'public/assets/images',
  'public/assets/icons',
  'public/assets/fonts',
  'tests/unit',
  'tests/integration',
  'tests/e2e',
];

// Tạo folders
folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✓ Created: ${folder}`);
  }
});

console.log('\n📝 Moving files...\n');

// Danh sách files cần di chuyển
const filesToMove = [
  // Main process
  { from: 'src-main-index.ts', to: 'src/main/index.ts' },
  { from: 'src-main-api-server.ts', to: 'src/main/api-server.ts' },
  
  // Preload
  { from: 'src-preload-index.ts', to: 'src/preload/index.ts' },
  
  // Renderer
  { from: 'src-renderer-main.tsx', to: 'src/renderer/main.tsx' },
  { from: 'src-renderer-App.tsx', to: 'src/renderer/App.tsx' },
  { from: 'src-renderer-styles-index.css', to: 'src/renderer/styles/index.css' },
  
  // API
  { from: 'src-api-server.ts', to: 'src/api/server.ts' },
  { from: 'src-api-config-database.ts', to: 'src/api/config/database.ts' },
  { from: 'src-api-controllers-auth.controller.ts', to: 'src/api/controllers/auth.controller.ts' },
  { from: 'src-api-middleware-errorHandler.ts', to: 'src/api/middleware/errorHandler.ts' },
  { from: 'src-api-middleware-notFoundHandler.ts', to: 'src/api/middleware/notFoundHandler.ts' },
  { from: 'src-api-middleware-validation.ts', to: 'src/api/middleware/validation.ts' },
  
  // API Routes
  { from: 'src-api-routes-index.ts', to: 'src/api/routes/index.ts' },
  { from: 'src-api-routes-auth.routes.ts', to: 'src/api/routes/auth.routes.ts' },
  { from: 'src-api-routes-user.routes.ts', to: 'src/api/routes/user.routes.ts' },
  { from: 'src-api-routes-product.routes.ts', to: 'src/api/routes/product.routes.ts' },
  { from: 'src-api-routes-order.routes.ts', to: 'src/api/routes/order.routes.ts' },
  { from: 'src-api-routes-table.routes.ts', to: 'src/api/routes/table.routes.ts' },
  { from: 'src-api-routes-inventory.routes.ts', to: 'src/api/routes/inventory.routes.ts' },
  { from: 'src-api-routes-report.routes.ts', to: 'src/api/routes/report.routes.ts' },
  { from: 'src-api-routes-staff.routes.ts', to: 'src/api/routes/staff.routes.ts' },
  
  // Shared
  { from: 'src-shared-types-index.ts', to: 'src/shared/types/index.ts' },
  { from: 'src-shared-constants-index.ts', to: 'src/shared/constants/index.ts' },
  
  // Database
  { from: 'src-database-schemas-schema.sql', to: 'src/database/schemas/schema.sql' },
  
  // Scripts
  { from: 'scripts-migrate.js', to: 'scripts/migrate.js' },
  { from: 'scripts-seed.js', to: 'scripts/seed.js' },
  { from: 'scripts-reset-db.js', to: 'scripts/reset-db.js' },
];

// Di chuyển files
let movedCount = 0;
let errorCount = 0;

filesToMove.forEach(({ from, to }) => {
  const fromPath = path.join(__dirname, from);
  const toPath = path.join(__dirname, to);
  
  if (fs.existsSync(fromPath)) {
    try {
      fs.renameSync(fromPath, toPath);
      console.log(`✓ Moved: ${from} → ${to}`);
      movedCount++;
    } catch (error) {
      console.error(`✗ Error moving ${from}:`, error.message);
      errorCount++;
    }
  } else {
    console.log(`⊘ Skip: ${from} (not found)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Done! Moved ${movedCount} files`);
if (errorCount > 0) {
  console.log(`⚠️  ${errorCount} errors occurred`);
}
console.log('='.repeat(50));
console.log('\n📋 Next steps:');
console.log('  1. npm install');
console.log('  2. Copy .env.example to .env and configure');
console.log('  3. npm run migrate');
console.log('  4. npm run seed');
console.log('  5. npm run dev\n');
