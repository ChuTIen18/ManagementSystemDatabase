# Project Structure

## 1. Overview
This project is a full-stack Coffee House Management System built with:
- Backend: Node.js, Express, TypeScript, MySQL
- Frontend: React, Vite, TypeScript, Tailwind CSS
- Auth: JWT-based login with role-based access control
- Database: MySQL schema with orders, users, schedules, attendance, salary, leave requests, inventory, equipment, promotions, tables, feedback, and reporting views

The project is organized to separate:
- business logic in `services/`
- HTTP handling in `controllers/`
- API mapping in `routes/`
- UI screens in `frontend/src/pages/`
- shared UI shell in `frontend/src/layouts/`
- API client logic in `frontend/src/services/api.ts`

---

## 2. Root Folder Structure

```text
ManagementSystemDatabase/
├── backend/
├── frontend/
├── docs/
├── HISTORY.md
├── QUICK_START.sh
├── README.md
├── SETUP_GUIDE.md
├── SUMMARY.md
├── TESTING_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── docker-compose.yml
└── structure.md
```

### Root files meaning
- `README.md`: High-level project overview and setup summary.
- `SETUP_GUIDE.md`: Step-by-step setup instructions for local development.
- `SUMMARY.md`: Long-form project summary and feature breakdown.
- `HISTORY.md`: Development log of completed tasks and implementation steps.
- `TESTING_GUIDE.md`: Manual and automated smoke-test guidance.
- `DEPLOYMENT_GUIDE.md`: Docker-based deployment instructions.
- `QUICK_START.sh`: Quick startup helper for supported shells.
- `docker-compose.yml`: Full stack container orchestration.
- `structure.md`: This file, describing project structure and feature meaning.

---

## 3. Backend Structure

```text
backend/
├── Dockerfile
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── controllers/
    ├── infrastructure/
    ├── middlewares/
    ├── routes/
    ├── scripts/
    └── services/
```

### Backend entry points
- `src/index.ts`: Main Express server setup, middleware registration, route mounting, 404 handling, and error handling.
- `src/infrastructure/database.ts`: MySQL connection pool shared by all services.
- `src/middlewares/auth.ts`: JWT auth and role checks.
- `src/scripts/apiSmokeTest.ts`: Simple API smoke-test runner.

### Backend architecture meaning
The backend follows a layered pattern:
- `routes/` decides which URL maps to which controller method.
- `controllers/` validates request data and prepares HTTP responses.
- `services/` performs database operations and business rules.
- `infrastructure/` holds low-level shared setup like the MySQL pool.
- `middlewares/` handles auth and RBAC before the request reaches controllers.

---

## 4. Backend Modules

### 4.1 Auth
Files:
- `controllers/authController.ts`
- `services/authService.ts`
- `routes/auth.ts`
- `middlewares/auth.ts`

Meaning:
- Handles login, token refresh, logout, and current-user lookup.
- Verifies JWT access tokens.
- Checks whether a user is allowed to access a route based on role.

Web function meaning:
- Lets users sign in to the system and get access based on their role.
- Keeps sessions safe with token-based authentication.

### 4.2 Users
Files:
- `controllers/userController.ts`
- `services/userService.ts`
- `routes/users.ts`

Meaning:
- Manages employee accounts.
- Supports create, read, update, delete, and role-based visibility.

Web function meaning:
- Lets managers manage staff accounts.
- Controls who can access staff-only, POS-only, or manager-only features.

### 4.3 Schedules
Files:
- `controllers/scheduleController.ts`
- `services/scheduleService.ts`
- `routes/schedules.ts`

Meaning:
- Handles shift scheduling and approvals.
- Supports schedule creation, approval, rejection, and deletion.

Web function meaning:
- Lets managers assign shifts and staff request or view schedules.
- Ensures attendance and salary logic can rely on approved shifts.

### 4.4 Attendance
Files:
- `controllers/attendanceController.ts`
- `services/attendanceService.ts`
- `routes/attendance.ts`

Meaning:
- Handles check-in, check-out, attendance retrieval, and note updates.
- Detects late check-in based on scheduled shift time.

Web function meaning:
- Lets staff check in and out for work.
- Lets managers review attendance and identify late arrivals.

### 4.5 Salary
Files:
- `controllers/salaryController.ts`
- `services/salaryService.ts`
- `routes/salary.ts`

Meaning:
- Calculates salary from worked hours, hourly rate, bonus, and deductions.
- Supports salary review, editing, and payment marking.

Web function meaning:
- Lets managers compute pay from attendance records.
- Lets payroll be tracked and marked as paid.

### 4.6 Leave Requests
Files:
- `controllers/leaveRequestController.ts`
- `services/leaveRequestService.ts`
- `routes/leave-requests.ts`

Meaning:
- Supports leave request creation, approval, rejection, cancellation, and filtering.
- Tracks pending/approved/rejected workflow.

Web function meaning:
- Lets staff request time off.
- Lets managers approve or reject leave.
- Supports salary deduction and staffing planning.

### 4.7 Inventory
Files:
- `controllers/inventoryController.ts`
- `services/inventoryService.ts`
- `routes/inventory.ts`

Meaning:
- Manages inventory items, stock increases, stock decreases, and low-stock alerts.
- Records last updated by and optional transaction logging.

Web function meaning:
- Lets managers track ingredients and supplies.
- Prevents stock from going below safe levels.
- Helps operations avoid shortages.

### 4.8 Equipment
Files:
- `controllers/equipmentController.ts`
- `services/equipmentService.ts`
- `routes/equipment.ts`

Meaning:
- Manages coffee shop equipment records.
- Tracks purchase info, warranty, location, maintenance, and status.

Web function meaning:
- Lets managers monitor machines and tools.
- Helps track maintenance schedules and equipment health.

### 4.9 Promotions
Files:
- `controllers/promotionsController.ts`
- `services/promotionsService.ts`
- `routes/promotions.ts`

Meaning:
- Creates discount campaigns.
- Applies percentage or fixed discounts to orders.
- Supports date windows, minimum order thresholds, and discount caps.

Web function meaning:
- Lets managers run promotional campaigns.
- Lets POS/manager apply discounts to orders.
- Helps increase sales and manage deals.

### 4.10 Tables
Files:
- `controllers/tablesController.ts`
- `services/tablesService.ts`
- `routes/tables.ts`

Meaning:
- Manages table records, capacity, QR codes, availability, and deletion.
- Supports filtering to available tables only.

Web function meaning:
- Lets managers manage seating layout.
- Supports dine-in order placement and table occupancy tracking.

### 4.11 Feedback
Files:
- `controllers/feedbackController.ts`
- `services/feedbackService.ts`
- `routes/feedback.ts`

Meaning:
- Handles customer feedback per order.
- Handles internal POS feedback for stock, equipment, and staffing issues.
- Supports satisfaction summaries.

Web function meaning:
- Lets customers rate their experience.
- Lets staff report operational problems.
- Helps management improve service quality.

### 4.12 Reports
Files:
- `controllers/reportsController.ts`
- `services/reportsService.ts`
- `routes/reports.ts`

Meaning:
- Aggregates daily revenue, low stock alerts, top-selling items, and satisfaction metrics.
- Reads from SQL views and summary queries.

Web function meaning:
- Gives managers a dashboard for business performance.
- Helps monitor sales, operations, and customer satisfaction.

### 4.13 Orders
Files:
- `controllers/orderController.ts`
- `services/orderService.ts`
- `routes/orders.ts`

Meaning:
- Handles order creation, status updates, item changes, payment updates, and cancellation.

Web function meaning:
- Lets POS and managers create and manage customer orders.
- Supports dine-in, takeaway, and delivery workflows.

### 4.14 Menu
Files:
- `controllers/menuController.ts`
- `services/menuService.ts`
- `routes/menu.ts`

Meaning:
- Manages menu items and availability.

Web function meaning:
- Lets the business maintain products shown to customers and staff.
- Supports item creation, editing, activation, and removal.

### 4.15 Smoke Test
Files:
- `scripts/apiSmokeTest.ts`

Meaning:
- Runs simple API checks for health, menu, feedback, and reports.

Web function meaning:
- Verifies that important endpoints respond correctly after setup or deployment.

---

## 5. Frontend Structure

```text
frontend/
├── Dockerfile
├── nginx.conf
├── index.html
├── package.json
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── contexts/
    ├── layouts/
    ├── pages/
    ├── services/
    └── styles/
```

### Frontend entry points
- `src/main.tsx`: React entry point.
- `src/App.tsx`: Main router and protected route setup.
- `src/layouts/DashboardLayout.tsx`: Shared app shell with sidebar and outlet.
- `src/contexts/AuthContext.tsx`: Client-side auth state and user session data.
- `src/services/api.ts`: Axios client and API wrapper methods.

---

## 6. Frontend Pages and What They Mean

### LoginPage
Meaning:
- Handles user sign-in.
- Starts the authenticated session.

### ManagerDashboard
Meaning:
- Overview screen for managers.
- Typically used to jump to operational modules and summary information.

### POSDashboard
Meaning:
- Dashboard for cashiers or POS users.
- Focuses on order flow and service operations.

### StaffDashboard
Meaning:
- Dashboard for staff members.
- Focuses on personal work and relevant tasks.

### OrdersPage
Meaning:
- Main order management screen.
- Create orders, add items, update status, handle payment, cancel orders.

### MenuPage
Meaning:
- Menu maintenance and browsing screen.
- Add or update products and availability.

### StaffManagement
Meaning:
- User administration screen for managers.
- Create, edit, and manage employee accounts.

### ScheduleManagement
Meaning:
- Shift planning and schedule approval screen.
- Staff can request, managers can approve.

### AttendanceManagement
Meaning:
- Check-in/check-out and attendance review screen.
- Staff see their own attendance; managers see broader records.

### LeaveManagement
Meaning:
- Leave request workflow screen.
- Staff submit leave; managers approve/reject.

### InventoryManagement
Meaning:
- Inventory item management screen.
- Add/remove stock, edit items, view low-stock alerts.

### EquipmentManagement
Meaning:
- Equipment tracking screen.
- Edit equipment, record maintenance, track warranty and status.

### PromotionsManagement
Meaning:
- Promotion campaign screen.
- Create discounts and apply promotions to orders.

### TableManagement
Meaning:
- Table and seating management screen.
- Create tables, update status, manage QR codes.

### CustomerFeedback
Meaning:
- Customer feedback submission and review screen.
- Capture ratings and comments for completed orders.

### ReportsAnalytics
Meaning:
- Manager reporting screen.
- Shows revenue, top items, low stock alerts, and satisfaction data.

---

## 7. Frontend Shared Components

### AuthContext
Meaning:
- Stores login state and current user information.
- Provides logout and auth loading state.

### DashboardLayout
Meaning:
- The main application shell.
- Provides sidebar navigation and renders nested pages.

### api.ts
Meaning:
- One shared API client for the frontend.
- Adds JWT token to requests and refreshes access tokens when needed.
- Exposes typed groups like `authAPI`, `ordersAPI`, `inventoryAPI`, `feedbackAPI`, and `reportsAPI`.

### styles/
Meaning:
- Shared CSS and theme files.
- Controls app-wide appearance.

---

## 8. Web Functions By Business Meaning

### Authentication and access control
- Login, refresh token, logout, and current-user lookup.
- Meaning: secure access to the app and keep users in the correct role.

### Staff administration
- Create, edit, delete, and manage staff roles.
- Meaning: control who can access which modules.

### Shift planning
- Create and approve schedules.
- Meaning: organize work shifts so the shop is staffed correctly.

### Attendance tracking
- Check in, check out, view attendance, detect lateness.
- Meaning: record working time and late arrivals.

### Payroll
- Calculate salary from attendance and hourly rates.
- Meaning: automate monthly wage calculation.

### Leave workflow
- Submit, approve, reject, and cancel leave requests.
- Meaning: manage time off and staffing availability.

### Order operations
- Create orders, add/remove items, update status, handle payment, cancel orders.
- Meaning: run day-to-day sales and customer order flow.

### Menu management
- Create and maintain drink/food items.
- Meaning: keep the item catalog accurate and available.

### Inventory control
- Add/remove stock and track shortages.
- Meaning: ensure ingredients and supplies are available.

### Equipment control
- Track machines and maintenance.
- Meaning: keep equipment working and reduce breakdown risk.

### Promotions
- Create and apply discounts.
- Meaning: run marketing campaigns and special offers.

### Table management
- Create and manage seating tables.
- Meaning: support dine-in seating and table occupancy.

### Customer feedback
- Collect ratings and comments.
- Meaning: measure customer experience after an order.

### POS feedback
- Report internal operational issues.
- Meaning: let staff raise stock or equipment problems.

### Reports and analytics
- Revenue, top items, stock alerts, and satisfaction summaries.
- Meaning: give management visibility into business performance.

### Testing and deployment
- Smoke testing and Docker deployment.
- Meaning: verify the app works and provide a repeatable production-style setup.

---

## 9. High-Level Flow
1. User logs in through the frontend.
2. Frontend stores the access token and user role.
3. Protected routes show the correct dashboard and pages.
4. Frontend calls the backend API through `api.ts`.
5. Backend routes send the request to a controller.
6. Controller validates the request and calls a service.
7. Service reads or writes MySQL data.
8. Response returns to the frontend and updates the UI.

---

## 10. Deployment Structure
- `backend/Dockerfile`: Builds and runs the API.
- `frontend/Dockerfile`: Builds the React app and serves it with Nginx.
- `frontend/nginx.conf`: Supports React Router refresh routing.
- `docker-compose.yml`: Runs MySQL, backend, and frontend together.
- `DEPLOYMENT_GUIDE.md`: Explains how to build and run the stack.

---

## 11. Summary
This project is structured as a clean service-based full-stack application.

The backend handles:
- authentication
- employees
- schedules
- attendance
- salary
- leave requests
- orders
- menu
- inventory
- equipment
- promotions
- tables
- feedback
- reports

The frontend handles:
- login
- dashboards
- management screens
- reporting screens
- feedback screens
- deployment-friendly production build output

In short:
- Controllers answer the question: "What should the API do with this request?"
- Services answer the question: "How does the business logic and database work?"
- Routes answer the question: "Which URL calls which controller?"
- Pages answer the question: "What does the user see and do in the browser?"
