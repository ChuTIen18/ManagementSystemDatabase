# Coffee Shop Management - Quick Start Guide

## 🚀 Bắt đầu nhanh

### 1. Chạy script tạo cấu trúc thư mục
```bash
node create-structure.js
```

### 2. Di chuyển các file vào đúng vị trí

Sau khi chạy script, các file có prefix cần được move vào folder tương ứng:

```bash
# Main process
src-main-index.ts → src/main/index.ts
src-main-api-server.ts → src/main/api-server.ts

# Preload
src-preload-index.ts → src/preload/index.ts

# Renderer (React)
src-renderer-main.tsx → src/renderer/main.tsx
src-renderer-App.tsx → src/renderer/App.tsx
src-renderer-styles-index.css → src/renderer/styles/index.css

# API Server
src-api-server.ts → src/api/server.ts
src-api-config-database.ts → src/api/config/database.ts

# API Controllers
src-api-controllers-auth.controller.ts → src/api/controllers/auth.controller.ts

# API Middleware
src-api-middleware-errorHandler.ts → src/api/middleware/errorHandler.ts
src-api-middleware-notFoundHandler.ts → src/api/middleware/notFoundHandler.ts
src-api-middleware-validation.ts → src/api/middleware/validation.ts

# API Routes
src-api-routes-index.ts → src/api/routes/index.ts
src-api-routes-auth.routes.ts → src/api/routes/auth.routes.ts
src-api-routes-user.routes.ts → src/api/routes/user.routes.ts
src-api-routes-product.routes.ts → src/api/routes/product.routes.ts
src-api-routes-order.routes.ts → src/api/routes/order.routes.ts
src-api-routes-table.routes.ts → src/api/routes/table.routes.ts
src-api-routes-inventory.routes.ts → src/api/routes/inventory.routes.ts
src-api-routes-report.routes.ts → src/api/routes/report.routes.ts
src-api-routes-staff.routes.ts → src/api/routes/staff.routes.ts

# Shared
src-shared-types-index.ts → src/shared/types/index.ts
src-shared-constants-index.ts → src/shared/constants/index.ts

# Database
src-database-schemas-schema.sql → src/database/schemas/schema.sql

# Scripts
scripts-migrate.js → scripts/migrate.js
scripts-seed.js → scripts/seed.js
scripts-reset-db.js → scripts/reset-db.js
```

### 3. Hoặc sử dụng lệnh sau (Windows PowerShell)

Tạo file `move-files.ps1`:

```powershell
# Main
Move-Item "src-main-index.ts" "src/main/index.ts"
Move-Item "src-main-api-server.ts" "src/main/api-server.ts"

# Preload
Move-Item "src-preload-index.ts" "src/preload/index.ts"

# Renderer
Move-Item "src-renderer-main.tsx" "src/renderer/main.tsx"
Move-Item "src-renderer-App.tsx" "src/renderer/App.tsx"
Move-Item "src-renderer-styles-index.css" "src/renderer/styles/index.css"

# API
Move-Item "src-api-server.ts" "src/api/server.ts"
Move-Item "src-api-config-database.ts" "src/api/config/database.ts"
Move-Item "src-api-controllers-auth.controller.ts" "src/api/controllers/auth.controller.ts"
Move-Item "src-api-middleware-errorHandler.ts" "src/api/middleware/errorHandler.ts"
Move-Item "src-api-middleware-notFoundHandler.ts" "src/api/middleware/notFoundHandler.ts"
Move-Item "src-api-middleware-validation.ts" "src/api/middleware/validation.ts"

# Routes
Move-Item "src-api-routes-index.ts" "src/api/routes/index.ts"
Move-Item "src-api-routes-auth.routes.ts" "src/api/routes/auth.routes.ts"
Move-Item "src-api-routes-user.routes.ts" "src/api/routes/user.routes.ts"
Move-Item "src-api-routes-product.routes.ts" "src/api/routes/product.routes.ts"
Move-Item "src-api-routes-order.routes.ts" "src/api/routes/order.routes.ts"
Move-Item "src-api-routes-table.routes.ts" "src/api/routes/table.routes.ts"
Move-Item "src-api-routes-inventory.routes.ts" "src/api/routes/inventory.routes.ts"
Move-Item "src-api-routes-report.routes.ts" "src/api/routes/report.routes.ts"
Move-Item "src-api-routes-staff.routes.ts" "src/api/routes/staff.routes.ts"

# Shared
Move-Item "src-shared-types-index.ts" "src/shared/types/index.ts"
Move-Item "src-shared-constants-index.ts" "src/shared/constants/index.ts"

# Database
Move-Item "src-database-schemas-schema.sql" "src/database/schemas/schema.sql"

# Scripts
Move-Item "scripts-migrate.js" "scripts/migrate.js"
Move-Item "scripts-seed.js" "scripts/seed.js"
Move-Item "scripts-reset-db.js" "scripts/reset-db.js"

Write-Host "✅ All files moved successfully!"
```

Chạy:
```bash
powershell -ExecutionPolicy Bypass -File move-files.ps1
```

### 4. Cài đặt dependencies
```bash
npm install
```

### 5. Setup database
```bash
# Tạo file .env từ .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin MySQL của bạn

# Chạy migration
npm run migrate

# Insert dữ liệu mẫu
npm run seed
```

### 6. Chạy app
```bash
npm run dev
```

## 📦 Packages cần cài

Nếu gặp lỗi thiếu package, cài thêm:

```bash
npm install mysql2 bcryptjs --save
```

## ✅ Checklist

- [ ] Đã chạy `node create-structure.js`
- [ ] Đã move tất cả files vào đúng vị trí
- [ ] Đã cài `npm install`
- [ ] Đã tạo file `.env` và config database
- [ ] Đã chạy `npm run migrate`
- [ ] Đã chạy `npm run seed`
- [ ] Đã test `npm run dev`

## 🎯 Next Steps

1. Copy UI components từ `docs/UI_UX/src/components/` sang `src/renderer/components/`
2. Implement các API endpoints trong controllers
3. Tạo Sequelize models cho các bảng
4. Kết nối Frontend với Backend API
5. Test và debug

Good luck! ☕
