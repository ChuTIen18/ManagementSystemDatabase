# Ngrok + MySQL setup (đảm bảo web chạy ở đâu thì data vẫn lưu về MySQL của bạn)

## 1) Xác nhận hiện trạng dự án
Dự án này **đã dùng MySQL** ở backend:
- Driver: `mysql2`
- Cấu hình DB qua biến môi trường:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`

Frontend gọi API qua:
- `VITE_API_BASE_URL` (mặc định: `http://localhost:3000/api/v1`)

---

## 2) Nguyên tắc kiến trúc đúng
Để dữ liệu luôn về MySQL của bạn:

- MySQL + Backend phải chạy cố định trên máy/server của bạn.
- Frontend ở bất cứ đâu cũng chỉ gọi về backend của bạn.
- Không expose trực tiếp MySQL ra internet.
- Chỉ expose backend API (port 3000) qua ngrok.

---

## 3) Cấu hình backend

### 3.1 CORS
Backend đã hỗ trợ:
- `CORS_ORIGINS` (comma-separated)
- fallback `CORS_ORIGIN`
- cho phép domain ngrok (`*.ngrok-free.app`, `*.ngrok.app`)

Ví dụ trong `backend/.env`:
```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://your-frontend-domain.com,https://xxxx.ngrok-free.app
```

### 3.2 DB
Ví dụ `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coffee_house
PORT=3000
API_PREFIX=/api/v1
```

---

## 4) Chạy MySQL + Backend

## Cách A: dùng Docker Compose (khuyến nghị local nhanh)
```bash
docker compose up -d db backend
```
(thực thi trong thư mục `ManagementSystemDatabase/`)

## Cách B: dùng MySQL bạn tự cài
- Đảm bảo MySQL đang chạy
- Đảm bảo schema/tables đã import
- Chạy backend:
```bash
cd backend
npm run dev
```

---

## 5) Expose backend bằng ngrok

### 5.1 Cài và login ngrok (một lần)
```bash
ngrok config add-authtoken <YOUR_NGROK_TOKEN>
```

### 5.2 Mở tunnel tới backend port 3000
```bash
ngrok http 3000
```

Bạn sẽ nhận được URL dạng:
- `https://xxxx.ngrok-free.app`

Backend API public sẽ là:
- `https://xxxx.ngrok-free.app/api/v1`

---

## 6) Cấu hình frontend để gọi đúng backend của bạn

Trong `frontend/.env` hoặc môi trường deploy frontend:
```env
VITE_API_BASE_URL=https://xxxx.ngrok-free.app/api/v1
```

Sau đó build/chạy lại frontend:
```bash
npm run build
# hoặc npm run dev
```

---

## 7) Kiểm tra dữ liệu có ghi về MySQL của bạn

1. Mở web từ máy khác / mạng khác.
2. Tạo mới dữ liệu (ví dụ promotion/order/menu item).
3. Vào MySQL của bạn kiểm tra:
```sql
USE coffee_house;
SELECT * FROM promotions ORDER BY promotion_id DESC LIMIT 5;
```

Nếu có record mới → xác nhận web ở nơi khác vẫn ghi vào MySQL của bạn.

---

