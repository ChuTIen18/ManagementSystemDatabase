# ⚡ HƯỚNG DẪN NHANH - BẮT ĐẦU NGAY

## 🎯 Chỉ cần 3 bước:

### **Bước 1: Chạy setup**
```bash
node setup-project.js
```
Hoặc double-click file `setup.bat` (Windows)

### **Bước 2: Cài đặt**
```bash
npm install
```

### **Bước 3: Chạy**
```bash
npm run dev
```

---

## ✅ Đó là tất cả!

Script `setup-project.js` sẽ tự động:
- Tạo tất cả subfolder cần thiết
- Di chuyển files vào đúng vị trí
- Báo cáo kết quả

---

## 📝 Setup Database (Optional)

Nếu muốn test với database:

```bash
# 1. Copy .env.example thành .env
copy .env.example .env

# 2. Edit .env với MySQL credentials

# 3. Tạo database
mysql -u root -p
CREATE DATABASE coffee_shop_db;
exit;

# 4. Chạy migration & seed
npm run migrate
npm run seed
```

---

## 📚 Docs đầy đủ

- `SETUP.md` - Hướng dẫn setup chi tiết
- `README.md` - Documentation đầy đủ
- `PROJECT_SUMMARY.md` - Tổng quan project
- `QUICKSTART.md` - Quick start guide

---

**Bắt đầu ngay: `node setup-project.js` ☕**
