# Coffee Shop Management System - Source Code Directory

Đây là thư mục nguồn chính cho hệ thống quản lý quán cà phê được xây dựng bằng Electron + React + Express.js + MySQL.

## 🏗️ Kiến Trúc Tổng Quan

```
src/
├── main/              # Electron Main Process (Quản lý ứng dụng)
├── preload/           # Electron Preload Scripts (Cầu nối IPC)
├── renderer/          # React Frontend (Giao diện người dùng)
├── api/               # Express.js Backend (API Server)
├── database/          # Database Schema & Migration
└── shared/            # Shared Code (Types & Constants)
```

## 📁 Chi Tiết Từng Thư Mục

### 🔹 `src/main/` - Electron Main Process

**Chức năng**: Quản lý vòng đời ứng dụng và cửa sổ chính

**Files chính**:
- **`index.ts`** - Entry point của Electron
  - Tạo và quản lý BrowserWindow
  - Khởi động API server tự động
  - Xử lý IPC communication (app info, version, path)
  - Development: load từ `http://localhost:3000` với DevTools
  - Production: load từ file HTML đã build

- **`api-server.ts`** - Quản lý Express API server
  - Khởi động API server trên port 3001
  - Tắt server khi quit ứng dụng

### 🔹 `src/preload/` - Electron Preload Scripts

**Chức năng**: Cầu nối bảo mật giữa Main và Renderer process

**Files chính**:
- **`index.ts`** - Context bridge cho IPC
  - Expose `electronAPI` object cho renderer
  - Cung cấp methods: `getAppVersion()`, `getAppName()`, `getAppPath()`
  - Sử dụng `contextBridge.exposeInMainWorld()` để bảo mật

### 🔹 `src/renderer/` - React Frontend

**Chức năng**: Giao diện người dùng chính (UI)

**Cấu trúc**:
```
renderer/
├── main.tsx              # React entry point
├── App.tsx              # Root component
├── components/          # UI components tái sử dụng (TRỐNG)
├── pages/              # Các trang của ứng dụng (TRỐNG)
├── hooks/              # Custom React hooks (TRỐNG)
├── store/              # Zustand state management (TRỐNG)
├── styles/             # CSS toàn cục
│   └── index.css      # TailwindCSS + base styles
└── utils/             # Helper functions (TRỐNG)
```

**Công nghệ sử dụng**:
- ✅ **React 18 + TypeScript** - UI framework
- ✅ **Vite** - Build tool với HMR nhanh
- ✅ **Tailwind CSS** - Styling framework
- ✅ **Zustand** - State management
- ✅ **React Router** - Điều hướng trang

**Ghi chú**: UI components được thiết kế sẵn trong `docs/UI_UX/src/components/`

### 🔹 `src/api/` - Express.js Backend

**Chức năng**: API server xử lý business logic và database

**Cấu trúc**:
```
api/
├── server.ts           # Express app setup
├── config/
│   └── database.ts     # Cấu hình Sequelize ORM + MySQL
├── controllers/
│   └── auth.controller.ts    # Logic xử lý authentication
├── models/             # Sequelize models (TRỐNG)
├── routes/             # Định nghĩa API endpoints
│   ├── index.ts        # Route aggregator
│   ├── auth.routes.ts  # Auth endpoints
│   ├── user.routes.ts  # User CRUD
│   ├── product.routes.ts
│   ├── order.routes.ts
│   ├── table.routes.ts
│   ├── inventory.routes.ts
│   ├── staff.routes.ts
│   └── report.routes.ts
├── middleware/         # Express middleware
│   ├── errorHandler.ts    # Xử lý lỗi toàn cục
│   ├── notFoundHandler.ts # Xử lý 404
│   └── validation.ts      # Joi validation schemas
├── services/           # Business logic layer (TRỐNG)
└── utils/             # API utilities (TRỐNG)
```

**API Endpoints được lên kế hoạch**:
```
POST   /api/auth/login       # Đăng nhập
POST   /api/auth/register    # Đăng ký
POST   /api/auth/logout      # Đăng xuất
POST   /api/auth/refresh     # Refresh JWT token

GET    /api/users            # Danh sách users
GET    /api/products         # Danh sách sản phẩm
GET    /api/orders           # Danh sách đơn hàng
GET    /api/tables           # Danh sách bàn
GET    /api/inventory        # Quản lý kho
GET    /api/staff            # Quản lý nhân viên
GET    /api/reports          # Báo cáo thống kê

GET    /health               # Health check
```

**Thư viện sử dụng**:
- ✅ **Express** - Web framework
- ✅ **Sequelize** - ORM cho MySQL
- ✅ **JWT** - Token authentication
- ✅ **Bcryptjs** - Mã hóa password
- ✅ **Joi** - Request validation
- ✅ **Helmet** - Security headers
- ✅ **Morgan** - HTTP logging

### 🔹 `src/database/` - Database Configuration

**Chức năng**: Schema, migration và seed data

**Cấu trúc**:
```
database/
├── schemas/            # SQL schema files (TRỐNG)
│   └── schema.sql     # Database schema chính
├── migrations/         # Database migration scripts (TRỐNG)
└── seeders/           # Dữ liệu mẫu (TRỐNG)
```

**Database được thiết kế**:
- `users` - Users với roles (staff, pos, manager, admin)
- `products` - Menu sản phẩm với giá
- `tables` - Bàn của quán với sức chứa
- `orders` - Đơn hàng của khách
- `order_items` - Chi tiết đơn hàng
- `inventory` - Nguyên liệu & tồn kho
- `attendance` - Chấm công nhân viên
- `schedules` - Lịch làm việc

### 🔹 `src/shared/` - Shared Code

**Chức năng**: Code dùng chung giữa các process

**Cấu trúc**:
```
shared/
├── types/
│   └── index.ts        # TypeScript interfaces & types
├── constants/
│   └── index.ts        # App constants
└── utils/             # Shared utilities (TRỐNG)
```

**Shared Types** (`types/index.ts`):
```typescript
User, Product, Order, OrderItem, Table, 
InventoryItem, Attendance, Schedule
```

**Shared Constants** (`constants/index.ts`):
```typescript
USER_ROLES: { STAFF, POS, MANAGER, ADMIN }
ORDER_STATUS: { PENDING, PROCESSING, COMPLETED, CANCELLED }
TABLE_STATUS: { AVAILABLE, OCCUPIED, RESERVED }
PAYMENT_METHODS: { CASH, CARD, DIGITAL }
API_BASE_URL: 'http://localhost:3001/api'
```

## 🚀 Công Nghệ Sử Dụng

### Frontend Stack
- **React 18.3.1** - UI library
- **TypeScript 5.3.3** - Type safety
- **Vite 6.3.5** - Build tool nhanh
- **TailwindCSS 4.1.12** - CSS framework
- **Zustand 4.4.7** - State management
- **React Router DOM 6.20.1** - Routing

### Backend Stack
- **Express 4.18.2** - Web framework
- **Sequelize 6.35.1** - ORM
- **MySQL2 3.6.5** - Database driver
- **JWT 9.0.2** - Authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Joi 17.11.0** - Validation

### Desktop Framework
- **Electron 28.0.0** - Desktop framework
- **Electron-builder 24.9.1** - Package & distribution

## 📋 Tình Trạng Hiện Tại

### ✅ Đã Hoàn Thành
- ✅ Cấu trúc project setup
- ✅ Electron main process & window management
- ✅ React app skeleton với Vite
- ✅ Express API server setup
- ✅ Database configuration (MySQL + Sequelize)
- ✅ Authentication routes scaffold
- ✅ Validation middleware (Joi)
- ✅ Error handling middleware
- ✅ Type definitions cho các entities chính
- ✅ API route structure (8 routes chính)

### ⏳ Đang Phát Triển
- ⏳ Implement authentication (login/register/JWT)
- ⏳ Implement data models (Sequelize models)
- ⏳ Implement business logic services
- ⏳ Implement tất cả API endpoints
- ⏳ Tạo database migrations
- ⏳ Tạo seed data
- ⏳ Xây dựng UI components (có sẵn trong `docs/UI_UX/`)
- ⏳ Implement state management (Zustand)
- ⏳ Implement pages và navigation

## 🛠️ Development Commands

```bash
npm run dev              # Chạy Electron + Vite
npm run dev:renderer    # Vite dev server (port 3000)
npm run dev:electron    # Electron với auto-reload
npm run dev:api         # API server với nodemon (port 3001)
npm run build           # Build tất cả
npm run lint            # ESLint check
npm run test            # Jest tests
```

## ⚙️ Environment Configuration

File `.env` cần thiết:
```env
NODE_ENV=development
API_PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffee_shop_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 🎯 Các Tính Năng Chính

1. **Quản lý nhân viên** với phân quyền (staff, POS, manager, admin)
2. **Hệ thống POS** (Point of Sale)
3. **Quản lý menu & sản phẩm**
4. **Quản lý đơn hàng**
5. **Quản lý bàn**
6. **Quản lý kho**
7. **Chấm công & lịch làm việc**
8. **Báo cáo tài chính & thống kê**
9. **Tạo hóa đơn với QR code**
10. **Hệ thống feedback khách hàng**

## 📝 Ghi Chú Quan Trọng

- Đây là **Electron desktop application** với embedded API server
- Database: MySQL với Sequelize ORM
- Security: Context isolation, JWT authentication, Joi validation
- UI Components thiết kế sẵn: `docs/UI_UX/src/components/`
- Project hiện tại ở **beta stage** - cấu trúc hoàn chỉnh, đang implement business logic

## 🔗 Tham Khảo Thêm

- Main README: `../README.md`
- Project Setup: `../SETUP.md` 
- Quick Start: `../QUICKSTART.md`
- UI/UX Design: `../docs/UI_UX/`

---

*Được tạo tự động cho Coffee Shop Management System*