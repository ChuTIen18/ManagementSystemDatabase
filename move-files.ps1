# PowerShell script to move files to correct locations

Write-Host "📦 Moving files to correct directories..." -ForegroundColor Cyan

# Main
Move-Item "src-main-index.ts" "src/main/index.ts" -Force
Move-Item "src-main-api-server.ts" "src/main/api-server.ts" -Force

# Preload
Move-Item "src-preload-index.ts" "src/preload/index.ts" -Force

# Renderer
Move-Item "src-renderer-main.tsx" "src/renderer/main.tsx" -Force
Move-Item "src-renderer-App.tsx" "src/renderer/App.tsx" -Force
Move-Item "src-renderer-styles-index.css" "src/renderer/styles/index.css" -Force

# API
Move-Item "src-api-server.ts" "src/api/server.ts" -Force
Move-Item "src-api-config-database.ts" "src/api/config/database.ts" -Force
Move-Item "src-api-controllers-auth.controller.ts" "src/api/controllers/auth.controller.ts" -Force
Move-Item "src-api-middleware-errorHandler.ts" "src/api/middleware/errorHandler.ts" -Force
Move-Item "src-api-middleware-notFoundHandler.ts" "src/api/middleware/notFoundHandler.ts" -Force
Move-Item "src-api-middleware-validation.ts" "src/api/middleware/validation.ts" -Force

# Routes
Move-Item "src-api-routes-index.ts" "src/api/routes/index.ts" -Force
Move-Item "src-api-routes-auth.routes.ts" "src/api/routes/auth.routes.ts" -Force
Move-Item "src-api-routes-user.routes.ts" "src/api/routes/user.routes.ts" -Force
Move-Item "src-api-routes-product.routes.ts" "src/api/routes/product.routes.ts" -Force
Move-Item "src-api-routes-order.routes.ts" "src/api/routes/order.routes.ts" -Force
Move-Item "src-api-routes-table.routes.ts" "src/api/routes/table.routes.ts" -Force
Move-Item "src-api-routes-inventory.routes.ts" "src/api/routes/inventory.routes.ts" -Force
Move-Item "src-api-routes-report.routes.ts" "src/api/routes/report.routes.ts" -Force
Move-Item "src-api-routes-staff.routes.ts" "src/api/routes/staff.routes.ts" -Force

# Shared
Move-Item "src-shared-types-index.ts" "src/shared/types/index.ts" -Force
Move-Item "src-shared-constants-index.ts" "src/shared/constants/index.ts" -Force

# Database
Move-Item "src-database-schemas-schema.sql" "src/database/schemas/schema.sql" -Force

# Scripts
Move-Item "scripts-migrate.js" "scripts/migrate.js" -Force
Move-Item "scripts-seed.js" "scripts/seed.js" -Force
Move-Item "scripts-reset-db.js" "scripts/reset-db.js" -Force

Write-Host "✅ All files moved successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. npm install" -ForegroundColor White
Write-Host "  2. Copy .env.example to .env and configure" -ForegroundColor White
Write-Host "  3. npm run migrate" -ForegroundColor White
Write-Host "  4. npm run seed" -ForegroundColor White
Write-Host "  5. npm run dev" -ForegroundColor White
