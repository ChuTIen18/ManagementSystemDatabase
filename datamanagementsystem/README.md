# ☕ Coffee Shop Management Desktop Application

Hệ thống quản lý quán cà phê - Desktop Application sử dụng Electron, React, TypeScript và MySQL.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Build và Package](#build-và-package)
- [Database Setup](#database-setup)

---

## 🎯 Tổng quan

Ứng dụng desktop quản lý quán cà phê với đầy đủ tính năng:
- ✅ Quản lý nhân viên và phân quyền (Staff, POS, Manager, Admin)
- ✅ Hệ thống POS (Point of Sale) cho máy tính tiền
- ✅ Quản lý menu, sản phẩm, giá cả
- ✅ Quản lý bàn, đơn hàng
- ✅ Quản lý kho, nguyên liệu
- ✅ Báo cáo doanh thu, thống kê
- ✅ Quản lý ca làm việc, chấm công
- ✅ In hóa đơn với QR code
- ✅ Đánh giá từ khách hàng

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **Electron** - Desktop application framework
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Dev Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)
- **Jest** - Testing framework
- **Nodemon** - Auto-reload during development

---

## 📁 Cấu trúc thư mục

```
coffee-shop-management/
│
├── src/                          # Source code chính
│   ├── main/                     # Electron Main Process
│   │   ├── index.ts             # Entry point của Electron
│   │   └── api-server.ts        # Khởi động API server trong Electron
│   │
│   ├── preload/                  # Electron Preload Scripts
│   │   └── index.ts             # Bridge giữa Main và Renderer process
│   │
│   ├── renderer/                 # React Frontend (Renderer Process)
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Zustand stores (state management)
│   │   ├── styles/              # CSS files
│   │   │   └── index.css       # Global styles
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point cho React
│   │
│   ├── api/                      # Express API Server
│   │   ├── controllers/         # Request handlers
│   │   │   └── auth.controller.ts
│   │   ├── models/              # Sequelize models
│   │   ├── routes/              # API routes
│   │   │   ├── index.ts        # Routes aggregator
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   ├── table.routes.ts
│   │   │   ├── inventory.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   └── staff.routes.ts
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFoundHandler.ts
│   │   │   └── validation.ts
│   │   ├── config/              # Configuration files
│   │   │   └── database.ts     # Database connection config
│   │   ├── services/            # Business logic services
│   │   ├── utils/               # Utility functions
│   │   └── server.ts            # Express app setup
│   │
│   ├── database/                 # Database related files
│   │   ├── migrations/          # Database migrations
│   │   ├── seeders/             # Seed data
│   │   └── schemas/             # SQL schemas
│   │       └── schema.sql      # Main database schema
│   │
│   └── shared/                   # Code dùng chung giữa Main, Renderer và API
│       ├── types/               # TypeScript types & interfaces
│       │   └── index.ts
│       ├── constants/           # Constants
│       │   └── index.ts
│       └── utils/               # Shared utilities
│
├── public/                       # Static assets
│   └── assets/
│       ├── images/              # Images
│       ├── icons/               # App icons
│       └── fonts/               # Custom fonts
│
├── tests/                        # Tests
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
│
├── scripts/                      # Build và utility scripts
│   ├── migrate.js               # Database migration script
│   ├── seed.js                  # Database seeding script
│   └── reset-db.js              # Reset database script
│
├── config/                       # App configuration
│
├── logs/                         # Application logs
│
├── dist/                         # Build output (generated)
│   ├── main/                    # Compiled main process
│   ├── renderer/                # Compiled renderer
│   └── api/                     # Compiled API server
│
├── release/                      # Packaged app (generated)
│
├── docs/                         # Documentation
│   └── UI_UX/                   # Figma UI/UX design files
│
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .eslintrc.js                  # ESLint configuration
├── package.json                  # Dependencies và scripts
├── tsconfig.json                 # TypeScript config for Renderer
├── tsconfig.main.json            # TypeScript config for Main process
├── tsconfig.api.json             # TypeScript config for API
├── vite.config.ts                # Vite configuration
└── README.md                     # This file

```

---

## 🔧 Cài đặt

### Yêu cầu hệ thống
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd datamanagementsystem
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa file .env với thông tin của bạn
```

**File .env:**
```env
NODE_ENV=development

# API Server
API_PORT=3001
API_HOST=localhost

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffee_shop_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Bước 4: Setup Database

1. **Tạo database:**
```bash
mysql -u root -p
CREATE DATABASE coffee_shop_db;
exit;
```

2. **Import schema:**
```bash
mysql -u root -p coffee_shop_db < src/database/schemas/schema.sql
```

3. **Hoặc sử dụng script:**
```bash
npm run migrate
npm run seed
```

---

## 🚀 Chạy ứng dụng

### Development Mode

**Terminal 1 - Chạy Vite dev server (Frontend):**
```bash
npm run dev:renderer
```

**Terminal 2 - Chạy Electron:**
```bash
npm run dev:electron
```

**Hoặc chạy tất cả cùng lúc:**
```bash
npm run dev
```

### Chạy riêng API server (để test)
```bash
npm run dev:api
```

---

## 📦 Build và Package

### Build source code
```bash
npm run build
```

Lệnh này sẽ:
1. Build React app (Vite)
2. Compile TypeScript (Main process)
3. Compile TypeScript (API server)

### Package thành executable

**Windows:**
```bash
npm run package:win
```

**macOS:**
```bash
npm run package:mac
```

**Linux:**
```bash
npm run package:linux
```

**Tất cả platforms:**
```bash
npm run package
```

File output sẽ nằm trong folder `release/`

---

## 🗄️ Database Setup

### Schema chính

Database gồm các bảng:
- `users` - Người dùng và nhân viên
- `products` - Sản phẩm, menu
- `tables` - Bàn trong quán
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `inventory` - Kho nguyên liệu
- `attendance` - Chấm công
- `schedules` - Lịch làm việc

### Migrations

```bash
# Chạy migrations
npm run migrate

# Reset database
npm run db:reset
```

### Seed data

```bash
# Insert dữ liệu mẫu
npm run seed
```

---

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Watch mode
npm run test:watch
```

---

## 📝 Scripts có sẵn

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy app ở development mode |
| `npm run dev:renderer` | Chạy Vite dev server |
| `npm run dev:electron` | Chạy Electron với nodemon |
| `npm run dev:api` | Chạy API server riêng |
| `npm run build` | Build toàn bộ project |
| `npm run build:renderer` | Build React app |
| `npm run build:main` | Compile Main process |
| `npm run build:api` | Compile API server |
| `npm start` | Chạy app đã build |
| `npm run package` | Package app cho tất cả platforms |
| `npm run package:win` | Package cho Windows |
| `npm run package:mac` | Package cho macOS |
| `npm run package:linux` | Package cho Linux |
| `npm run lint` | Chạy ESLint |
| `npm run lint:fix` | Fix lỗi ESLint tự động |
| `npm test` | Chạy tests |
| `npm run migrate` | Chạy database migrations |
| `npm run seed` | Insert seed data |
| `npm run db:reset` | Reset database |

---

## 🔐 Phân quyền người dùng

### Roles
- **Admin** - Toàn quyền quản trị hệ thống
- **Manager** - Quản lý quán (báo cáo, nhân viên, kho)
- **POS** - Nhân viên thu ngân (nhận đơn, thanh toán)
- **Staff** - Nhân viên phục vụ (nhận order, phục vụ)

---

## 🎨 UI/UX Design

Design gốc từ Figma: `docs/UI_UX/`

Để sử dụng lại các components đã design:
1. Copy components từ `docs/UI_UX/src/components/`
2. Paste vào `src/renderer/components/`
3. Adjust imports và paths

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users` - Danh sách users
- `GET /api/users/:id` - Chi tiết user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Products
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Orders
- `GET /api/orders` - Danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật đơn hàng
- `DELETE /api/orders/:id` - Hủy đơn hàng

*...và nhiều endpoints khác*

---

## 🛣️ Roadmap

- [ ] Hoàn thiện tất cả API endpoints
- [ ] Implement authentication & authorization
- [ ] Tích hợp UI/UX từ Figma design
- [ ] Thêm real-time updates (WebSocket)
- [ ] In hóa đơn
- [ ] Báo cáo chi tiết
- [ ] Export Excel, PDF
- [ ] Backup & restore database
- [ ] Multi-language support
- [ ] Dark mode

---

## 📄 License

MIT License

---

## 👥 Team

Nhóm 3 - Hệ thống quản lý quán cà phê

---

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.

---

**Happy Coding! ☕**
