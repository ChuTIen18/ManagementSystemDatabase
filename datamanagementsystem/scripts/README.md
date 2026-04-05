# 📁 Scripts Folder

Chứa các utility scripts để quản lý database và các tác vụ khác.

## Files

### `migrate.js`
- **Mục đích**: Chạy database migrations
- **Cách dùng**: `npm run migrate`
- **Chức năng**: Đọc file schema.sql và tạo/cập nhật các bảng trong MySQL database

### `seed.js`
- **Mục đích**: Insert dữ liệu mẫu vào database
- **Cách dùng**: `npm run seed`
- **Chức năng**: 
  - Tạo 4 user mẫu (admin, manager, staff, pos)
  - Tạo 5 sản phẩm mẫu
  - Tạo 5 bàn mẫu
- **Default credentials**: 
  - Username: `admin`
  - Password: `admin123`

### `reset-db.js`
- **Mục đích**: Reset database (xóa và tạo lại)
- **Cách dùng**: `npm run db:reset`
- **Chức năng**: DROP và CREATE lại database
- **⚠️ Cảnh báo**: Sẽ xóa TẤT CẢ dữ liệu!

## Thêm scripts mới

Bạn có thể tạo thêm scripts cho:
- Backup database
- Import/Export data
- Data migration giữa các versions
- Clean up old data
- Generate reports
