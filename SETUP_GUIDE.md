# ☕ Coffee House Management System - Setup & Run Guide

## 🎯 Project Overview

**Complete full-stack application** with:
- ✅ Database (16 tables, 4 triggers, 2 stored procedures, 4 views)
- ✅ Backend API (Express + TypeScript + MySQL)
- ✅ Frontend (React + TypeScript + Tailwind CSS)
- ✅ Authentication (JWT + RBAC)
- ✅ CRUD operations for Orders, Menu, Tables

---

## 📋 Pre-Setup Checklist

- [ ] MySQL 8.0+ installed and running
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🚀 Complete Setup Instructions

### Step 1: Database Setup (⏱️ 5 min)

```bash
# 1. Open MySQL Terminal
mysql -u root -p

# 2. Import database schema
# Enter MySQL password when prompted, then run:
source C:\Users\USER\OneDrive\Desktop\Everyhing_tosave\PussyU\ManagementSystemDatabase\ManagementSystemDatabase\docs\database_schema.sql

# 3. Verify tables created
USE coffee_house;
SHOW TABLES;
# Should show 16 tables

# 4. Check sample data
SELECT * FROM USERS;
# Should show 3 users (manager, pos, staff)

# 5. Exit MySQL
exit
```

### Step 2: Backend Setup (⏱️ 5 min)

```bash
# 1. Navigate to backend folder
cd C:\Users\USER\OneDrive\Desktop\Everyhing_tosave\PussyU\ManagementSystemDatabase\ManagementSystemDatabase\backend

# 2. Copy environment file
# Windows:
copy .env.example .env
# macOS/Linux:
# cp .env.example .env

# 3. Update .env with your DB credentials (open with editor)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=coffee_house

# Note: If npm install fails for jsonwebtoken, change version in package.json to ^9.0.2
# 4. Install dependencies
npm install
# or
pnpm install

# 5. Verify backend can start
npm run dev
# Should show: ✅ Coffee House API running on http://localhost:3000

# 6. Open new terminal (keep this one running)
```

### Step 3: Frontend Setup (⏱️ 5 min)

```bash
# 1. Open NEW terminal window
# Navigate to frontend folder
cd C:\Users\USER\OneDrive\Desktop\Everyhing_tosave\PussyU\ManagementSystemDatabase\ManagementSystemDatabase\frontend

# 2. Copy environment file
# Windows:
copy .env.example .env
# macOS/Linux:
# cp .env.example .env

# 3. Install dependencies
npm install
# or
pnpm install

# 4. Start frontend dev server
npm run dev
# Should show: Local: http://localhost:5173/
```

### Step 4: Test the App (⏱️ 2 min)

1. Open browser: http://localhost:5173
2. Login with credentials:
   - **Email**: manager@coffee.local
   - **Password**: (check database for hashed password)

3. If login fails, check:
   - Backend is running on port 3000 ✅
   - Frontend is running on port 5173 ✅
   - MySQL is running ✅
   - Database has users ✅

---

## 🏃 Daily Run Commands

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
# Port: 3000
# Health check: GET http://localhost:3000/health
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# Port: 5173
# Open: http://localhost:5173
```

---

## 📚 Available Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@coffee.local","password":"..."}'
```

### Get All Orders
```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <token>"
```

### Get All Menu Items (Public)
```bash
curl http://localhost:3000/api/v1/menu
```

See `coffee-vibecode/_context/api-endpoints.md` for complete API docs.

---

## 🔧 Troubleshooting

### ❌ "Cannot connect to MySQL"

### ❌ "mysql is not recognized"

**Solution**: This means the `mysql` command is not found in your system's PATH. You need to add the **MySQL Server** bin directory (not MySQL Shell) to your Windows PATH environment variable.
1.  **Verify MySQL Server Installation**: First, ensure MySQL Server is actually installed. Look for a folder like `C:\Program Files\MySQL\MySQL Server 8.0\` (version number may vary) and inside it, a `bin` folder containing `mysql.exe`.
2.  **Find the correct `bin` path**: The correct path is typically `C:\Program Files\MySQL\MySQL Server X.X\bin` (replace `X.X` with your version). *Avoid `C:\Program Files\MySQL\MySQL Shell X.X\bin` as it does NOT contain the `mysql` command.*
3.  **Add to PATH**:
    *   Search "Edit the system environment variables" in Windows Start Menu.
    *   Click **Environment Variables** > **System variables** > **Path** > **Edit** > **New**.
    *   Paste the correct `bin` path (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`), click OK.
4.  **RESTART YOUR TERMINAL**: You **must** close all existing PowerShell/Command Prompt windows and open a new one for the changes to take effect.

```bash
# Check if MySQL is running
# Windows: Check Services for MySQL80
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Start MySQL
# Windows: Services > MySQL80 > Start
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

### ❌ "Port 3000/5173 already in use"

```bash
# Find process using port
# Windows:
netstat -ano | findstr :3000

# macOS/Linux:
lsof -i :3000

# Kill process
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>
```

### ❌ "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# or with pnpm:
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ Database schema import fails

```bash
# 1. Check MySQL is running
mysql -u root -p -e "SELECT 1"

# 2. Create database manually first
mysql -u root -p -e "CREATE DATABASE coffee_house;"

# 3. Then import schema
mysql -u root -p coffee_house < docs/database_schema.sql
```

---

## 📊 Current Progress

**Phase 2: Backend Development** ✅ COMPLETE

- ✅ Database schema (16 tables)
- ✅ Backend boilerplate (Express + TS)
- ✅ Authentication (JWT + RBAC)
- ✅ API Routes (Auth, Orders, Menu)
- ✅ Frontend structure (React + TS)
- ✅ API integration (Axios client)

**Next Phase: Enhanced Features**

- 🔄 Tables management API
- 🔄 Staff/Schedules API
- 🔄 Inventory management
- 🔄 Reports & Analytics
- 🔄 WebSocket real-time updates
- 🔄 Frontend dashboard components

---

## 📁 Project Structure

```
ManagementSystemDatabase/
├── backend/
│   ├── src/
│   │   ├── controllers/        # HTTP handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middlewares/        # Auth, RBAC
│   │   ├── infrastructure/     # DB connection
│   │   └── index.ts            # Main app
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── layouts/            # Layout components
│   │   ├── contexts/           # Auth context
│   │   ├── services/           # API client
│   │   ├── styles/             # CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── .env.example
│   └── .gitignore
│
├── docs/
│   └── database_schema.sql     # Complete DB setup
│
├── coffee-vibecode/            # Project guidelines
├── README.md
└── .gitignore
```

---

## 💡 Tips & Best Practices

1. **Always use 2 terminals** - one for backend, one for frontend
2. **Keep MongoDB/MySQL running** - use system services
3. **Use Postman/Insomnia** - for API testing
4. **Check browser DevTools** - Network tab shows API calls
5. **Read error messages carefully** - they indicate the problem

---

## 🔐 Security Notes

⚠️ **For Development ONLY**

- JWT_SECRET in .env is placeholder - change in production
- Password hashing uses bcryptjs
- HTTPS not configured - use HTTP during development
- CORS allows localhost:5173 - configure for production

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| Backend URL | http://localhost:3000 |
| Frontend URL | http://localhost:5173 |
| API Base | http://localhost:3000/api/v1 |
| DB Host | localhost |
| DB Port | 3306 |
| DB Name | coffee_house |
| Default User | manager@coffee.local |

---

## ✅ Setup Complete!

Your Coffee House Management System is now ready to run!

**Start the app:**
1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `cd frontend && npm run dev`
3. Open: http://localhost:5173

Enjoy! ☕
