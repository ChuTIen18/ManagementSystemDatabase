# Coffee House Management System

A comprehensive management system for coffee shops built with React, Express, TypeScript, and MySQL.

## 🎯 Project Structure

```
ManagementSystemDatabase/
├── frontend/              # React + TypeScript
├── backend/               # Express + TypeScript + MySQL
├── docs/
│   └── database_schema.sql   # Complete database setup
└── README.md
```

## ✨ Features

- **Multi-role system**: Manager, POS, Staff
- **Order Management**: Create, track, and complete orders
- **Menu Management**: Manage menu items and availability
- **Staff Management**: Schedules, attendance, salary (coming soon)
- **Inventory Management**: Stock tracking, transactions (coming soon)
- **Reports & Analytics**: Revenue, top items, low stock alerts (coming soon)
- **Real-time Updates**: Order status tracking
- **RBAC**: Role-based access control on all routes

## 🛠️ Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Vite
- Axios
- React Router

**Backend:**
- Node.js 18+
- Express
- TypeScript
- MySQL 8.0+
- JWT Authentication

## 📋 Prerequisites

- **Node.js** 18+ and npm/pnpm
- **MySQL** 8.0+
- **Git**

## 🚀 Quick Start

### 1️⃣ Database Setup

```bash
# Open MySQL
mysql -u root -p

# Import schema
source docs/database_schema.sql

# Exit MySQL
exit
```

### 2️⃣ Backend Setup

```bash
cd backend

# Copy env file
cp .env.example .env

# Edit .env with your DB credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=coffee_house
# JWT_SECRET=your_secret_key

# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Copy env file
cp .env.example .env

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev
```

### 4️⃣ Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **API Docs**: Check `coffee-vibecode/_context/api-endpoints.md`

## 🔐 Demo Credentials

After importing the database, use these to login:

| Role    | Email                | Password | Default |
| ------- | -------------------- | -------- | ------- |
| Manager | manager@coffee.local | (in DB) | Manager |
| POS     | pos@coffee.local     | (in DB) | Cashier |
| Staff   | staff@coffee.local   | (in DB) | Barista |

> **Note**: Passwords are hashed in the database. For development, you may need to manually set them using bcrypt.

## 📚 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication

```
POST   /auth/login              - Login user
POST   /auth/refresh            - Refresh access token
GET    /auth/me                 - Get current user
POST   /auth/logout             - Logout
```

### Orders

```
GET    /orders                  - Get all orders
GET    /orders/:id              - Get order by ID
POST   /orders                  - Create new order (manager, pos)
PUT    /orders/:id/status       - Update order status
POST   /orders/:id/items        - Add item to order
DELETE /orders/:id/items/:itemId- Remove item from order
PUT    /orders/:id/payment      - Update payment
DELETE /orders/:id              - Cancel order
```

### Menu

```
GET    /menu                    - Get all menu items (public)
GET    /menu/:id                - Get menu item by ID (public)
POST   /menu                    - Create menu item (manager, pos)
PUT    /menu/:id                - Update menu item
PUT    /menu/:id/availability   - Toggle availability
DELETE /menu/:id                - Delete menu item
```

See `coffee-vibecode/_context/api-endpoints.md` for complete API documentation.

## 📖 Architecture

### Clean Architecture

The project follows clean architecture principles with separation of concerns:

```
backend/src/
├── controllers/   # HTTP handlers
├── services/      # Business logic
├── repositories/  # Data access
├── middlewares/   # Auth, RBAC
├── infrastructure/# Database connection
└── routes/        # API endpoints
```

### Database Schema

16 tables organized by modules:
- **User Management** (5 tables): Users, Schedules, Attendance, Leave, Salary
- **Orders** (3 tables): Tables, Orders, OrderItems
- **Menu** (1 table): MenuItems
- **Inventory** (3 tables): Suppliers, Stock, StockTransactions
- **Equipment** (1 table): Equipment
- **Feedback** (2 tables): POSFeedback, CustomerFeedback
- **Promotions** (1 table): Promotions

## 🔄 Development Workflow

### Backend Development

```bash
cd backend
npm run dev          # Start dev server with nodemon
npm run build        # Build TypeScript to JS
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## ⚙️ Configuration

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=coffee_house
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Coffee House Management System
```

## 📝 Important Notes

### Do NOT

- ❌ Directly modify `database_schema.sql` without consultation
- ❌ Return `password_hash` in any API response
- ❌ Use raw SQL without parameterized queries (SQL injection risk)
- ❌ Skip RBAC middleware on protected routes
- ❌ Modify order creation without using stored procedure `create_new_order()`
- ❌ Update stock directly; always use `STOCK_TRANSACTIONS`

### Must Do

- ✅ Verify JWT token in all protected routes
- ✅ Use TypeScript strictly (no `any` types)
- ✅ Implement error handling with standard response format
- ✅ Test RBAC permissions for each role
- ✅ Document API changes

## 🚨 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL is running:
```bash
# macOS
brew services start mysql

# Windows (use MySQL Installer)
# Linux
sudo systemctl start mysql
```

### Port Already in Use

```bash
# Backend (3000)
lsof -i :3000
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

### JWT Token Issues

- Check `JWT_SECRET` is set in `.env`
- Verify token is being sent in `Authorization` header
- Check token expiration time

## 📞 Support

For issues or questions, check:
- `coffee-vibecode/` - Project guidelines and vibe code
- Database schema: `docs/database_schema.sql`
- API docs: `coffee-vibecode/_context/api-endpoints.md`

---

**Last Updated**: 2026-04-27

Built with ❤️ for Coffee House Management
