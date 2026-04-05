# 🚀 Setup Instructions

## Bước 1: Chạy script setup

Mở terminal/command prompt tại thư mục project và chạy:

```bash
node setup-project.js
```

Script này sẽ:
- ✅ Tạo tất cả subfolder cần thiết trong src/, public/, tests/
- ✅ Di chuyển tất cả files có prefix vào đúng vị trí
- ✅ Báo cáo kết quả

## Bước 2: Cài đặt dependencies

```bash
npm install
```

## Bước 3: Cấu hình môi trường

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Sau đó edit file `.env` với thông tin MySQL của bạn:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffee_shop_db
```

## Bước 4: Setup database

```bash
# Tạo database trong MySQL trước
# mysql -u root -p
# CREATE DATABASE coffee_shop_db;
# exit;

# Chạy migration
npm run migrate

# Insert dữ liệu mẫu
npm run seed
```

## Bước 5: Chạy ứng dụng

```bash
npm run dev
```

## ✅ Checklist

- [ ] Đã chạy `node setup-project.js`
- [ ] Đã cài `npm install`
- [ ] Đã tạo và config file `.env`
- [ ] Đã tạo database trong MySQL
- [ ] Đã chạy `npm run migrate`
- [ ] Đã chạy `npm run seed`
- [ ] Đã test `npm run dev`

## 🎯 Kết quả mong đợi

Sau khi setup xong, cấu trúc folder sẽ như sau:

```
datamanagementsystem/
├── src/
│   ├── main/
│   │   ├── index.ts
│   │   └── api-server.ts
│   ├── preload/
│   │   └── index.ts
│   ├── renderer/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── styles/
│   │       └── index.css
│   ├── api/
│   │   ├── server.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFoundHandler.ts
│   │   │   └── validation.ts
│   │   └── routes/
│   │       ├── index.ts
│   │       ├── auth.routes.ts
│   │       ├── user.routes.ts
│   │       ├── product.routes.ts
│   │       ├── order.routes.ts
│   │       ├── table.routes.ts
│   │       ├── inventory.routes.ts
│   │       ├── report.routes.ts
│   │       └── staff.routes.ts
│   ├── database/
│   │   └── schemas/
│   │       └── schema.sql
│   └── shared/
│       ├── types/
│       │   └── index.ts
│       └── constants/
│           └── index.ts
├── scripts/
│   ├── migrate.js
│   ├── seed.js
│   └── reset-db.js
├── public/
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🆘 Troubleshooting

### Nếu script báo lỗi "file not found"
- Kiểm tra các file có prefix trong thư mục gốc
- Chạy lại `node setup-project.js`

### Nếu npm install lỗi
- Xóa `node_modules/` và `package-lock.json`
- Chạy lại `npm install`

### Nếu database connection lỗi
- Kiểm tra MySQL đang chạy
- Verify thông tin trong `.env`
- Tạo database bằng tay: `CREATE DATABASE coffee_shop_db;`

## 📚 Documentation

- Đọc `README.md` để biết chi tiết về project
- Đọc `PROJECT_SUMMARY.md` để xem tổng quan
- Xem `QUICKSTART.md` để bắt đầu nhanh

---

**Bắt đầu ngay! ☕**
