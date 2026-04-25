@echo off
echo Moving files to correct directories...

move "src-main-index.ts" "src\main\index.ts"
move "src-main-api-server.ts" "src\main\api-server.ts"

move "src-preload-index.ts" "src\preload\index.ts"

move "src-renderer-main.tsx" "src\renderer\main.tsx"
move "src-renderer-App.tsx" "src\renderer\App.tsx"
move "src-renderer-styles-index.css" "src\renderer\styles\index.css"

move "src-api-server.ts" "src\api\server.ts"
move "src-api-config-database.ts" "src\api\config\database.ts"
move "src-api-controllers-auth.controller.ts" "src\api\controllers\auth.controller.ts"
move "src-api-middleware-errorHandler.ts" "src\api\middleware\errorHandler.ts"
move "src-api-middleware-notFoundHandler.ts" "src\api\middleware\notFoundHandler.ts"
move "src-api-middleware-validation.ts" "src\api\middleware\validation.ts"

move "src-api-routes-index.ts" "src\api\routes\index.ts"
move "src-api-routes-auth.routes.ts" "src\api\routes\auth.routes.ts"
move "src-api-routes-user.routes.ts" "src\api\routes\user.routes.ts"
move "src-api-routes-product.routes.ts" "src\api\routes\product.routes.ts"
move "src-api-routes-order.routes.ts" "src\api\routes\order.routes.ts"
move "src-api-routes-table.routes.ts" "src\api\routes\table.routes.ts"
move "src-api-routes-inventory.routes.ts" "src\api\routes\inventory.routes.ts"
move "src-api-routes-report.routes.ts" "src\api\routes\report.routes.ts"
move "src-api-routes-staff.routes.ts" "src\api\routes\staff.routes.ts"

move "src-shared-types-index.ts" "src\shared\types\index.ts"
move "src-shared-constants-index.ts" "src\shared\constants\index.ts"

move "src-database-schemas-schema.sql" "src\database\schemas\schema.sql"

move "scripts-migrate.js" "scripts\migrate.js"
move "scripts-seed.js" "scripts\seed.js"
move "scripts-reset-db.js" "scripts\reset-db.js"

echo.
echo ✅ All files moved successfully!
echo.
echo Next steps:
echo   1. npm install
echo   2. Copy .env.example to .env and configure
echo   3. npm run migrate
echo   4. npm run seed
echo   5. npm run dev
pause
