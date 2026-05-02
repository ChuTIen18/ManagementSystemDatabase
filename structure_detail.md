# Structure Detail

## 1. Purpose
This file documents the structure of the Coffee House Management System repository in a more detailed way than `structure.md`.

It explains:
- how the repository is organized
- what each folder and major file does
- what each web function means in business terms
- how backend, frontend, database, testing, and deployment work together

---

## 2. Repository Root

### Root tree
```text
ManagementSystemDatabase/
├── backend/
├── frontend/
├── docs/
├── .dockerignore
├── DEPLOYMENT_GUIDE.md
├── docker-compose.yml
├── HISTORY.md
├── QUICK_START.sh
├── README.md
├── SETUP_GUIDE.md
├── structure.md
├── structure_detail.md
├── SUMMARY.md
└── TESTING_GUIDE.md
```

### Root file meaning
- `README.md`: main project summary and quick introduction.
- `SETUP_GUIDE.md`: how to install and run the app locally.
- `SUMMARY.md`: long project summary, design, and feature overview.
- `HISTORY.md`: implementation log for tasks 1 to 21.
- `TESTING_GUIDE.md`: smoke test and manual validation guide.
- `DEPLOYMENT_GUIDE.md`: Docker-based deployment instructions.
- `structure.md`: concise project structure overview.
- `structure_detail.md`: detailed structure and function explanation.
- `docker-compose.yml`: deploys MySQL, backend, and frontend containers.
- `.dockerignore`: excludes node_modules, dist, and temporary files from Docker builds.
- `QUICK_START.sh`: quick startup helper.

---

## 3. Main Architecture

The app is split into three layers:

### Backend
Handles:
- HTTP APIs
- authentication and authorization
- business rules
- database access
- reporting and smoke testing

### Frontend
Handles:
- login and session state
- dashboard and page navigation
- management screens for each feature
- API integration through a shared Axios client

### Database
Stores:
- users
- schedules
- attendance
- salary
- leave requests
- orders
- order items
- menu items
- inventory
- equipment
- promotions
- tables
- feedback
- reporting views

---

## 4. Backend Detailed Structure

### Backend tree
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
- `src/index.ts`: creates the Express app, mounts routes, sets middleware, and starts the server.
- `src/infrastructure/database.ts`: MySQL connection pool shared by all services.
- `src/middlewares/auth.ts`: JWT verification and role-based access checks.
- `src/scripts/apiSmokeTest.ts`: basic API verification script.

### Backend file-by-file index

#### `backend/src/index.ts`
Main server bootstrap.
- loads environment variables
- enables CORS and JSON parsing
- exposes `/health`
- mounts all route groups
- handles 404 and global errors
- starts the API server

Business meaning:
- this is the entry point for the whole API.
- all backend features are reachable through this file.

#### `backend/src/infrastructure/database.ts`
MySQL connection pool setup.
- reads DB credentials from `.env`
- creates shared connection pool

Business meaning:
- gives the backend a reusable and efficient path to the database.

#### `backend/src/middlewares/auth.ts`
Authentication and authorization middleware.
- verifies JWT access tokens
- optionally checks roles for protected endpoints

Business meaning:
- decides who can use which API route.
- protects manager-only and staff-only actions.

#### `backend/src/scripts/apiSmokeTest.ts`
API smoke test script.
- checks health endpoint
- checks menu, feedback, and reports endpoints
- supports optional bearer token

Business meaning:
- confirms that the app is alive after setup or deployment.

---

## 5. Backend Controllers, Services, and Routes

### 5.1 Auth
Files:
- `controllers/authController.ts`
- `services/authService.ts`
- `routes/auth.ts`

What they do:
- login and token refresh
- get current user info
- logout

Business meaning:
- users sign in and gain access based on role.

### 5.2 Users
Files:
- `controllers/userController.ts`
- `services/userService.ts`
- `routes/users.ts`

What they do:
- create, list, edit, and delete users
- enforce role-based visibility

Business meaning:
- managers can maintain employee accounts.
- the app knows whether someone is staff, POS, or manager.

### 5.3 Schedules
Files:
- `controllers/scheduleController.ts`
- `services/scheduleService.ts`
- `routes/schedules.ts`

What they do:
- create schedules
- approve/reject requests
- list schedules by staff or manager

Business meaning:
- schedules define who works when.
- attendance and payroll can depend on these records.

### 5.4 Attendance
Files:
- `controllers/attendanceController.ts`
- `services/attendanceService.ts`
- `routes/attendance.ts`

What they do:
- check-in and check-out
- late detection
- attendance listing and update notes

Business meaning:
- records working time for payroll and supervision.
- lets managers see punctuality and daily presence.

### 5.5 Salary
Files:
- `controllers/salaryController.ts`
- `services/salaryService.ts`
- `routes/salary.ts`

What they do:
- calculate salary from attendance hours
- add bonus and deductions
- mark salary as paid

Business meaning:
- automates employee pay calculation.
- reduces manual payroll work.

### 5.6 Leave Requests
Files:
- `controllers/leaveRequestController.ts`
- `services/leaveRequestService.ts`
- `routes/leave-requests.ts`

What they do:
- create leave requests
- approve or reject leave
- cancel pending requests
- calculate leave days

Business meaning:
- manages time-off workflow for staff and managers.
- supports staffing and payroll decisions.

### 5.7 Inventory
Files:
- `controllers/inventoryController.ts`
- `services/inventoryService.ts`
- `routes/inventory.ts`

What they do:
- create inventory items
- update item details
- add stock
- remove stock
- detect low stock

Business meaning:
- tracks ingredients and supplies.
- helps avoid stock shortages in operations.

### 5.8 Equipment
Files:
- `controllers/equipmentController.ts`
- `services/equipmentService.ts`
- `routes/equipment.ts`

What they do:
- create equipment records
- update status and details
- record maintenance
- detect overdue maintenance

Business meaning:
- tracks machines, tools, and repair history.
- helps the shop stay operational.

### 5.9 Promotions
Files:
- `controllers/promotionsController.ts`
- `services/promotionsService.ts`
- `routes/promotions.ts`

What they do:
- create and edit promotions
- toggle active status
- apply discounts to orders

Business meaning:
- runs discount campaigns and promo pricing.
- supports sales and marketing activity.

### 5.10 Tables
Files:
- `controllers/tablesController.ts`
- `services/tablesService.ts`
- `routes/tables.ts`

What they do:
- create tables
- update table capacity and status
- delete tables
- list available tables

Business meaning:
- manages dine-in seating.
- helps staff see which tables are free or occupied.

### 5.11 Feedback
Files:
- `controllers/feedbackController.ts`
- `services/feedbackService.ts`
- `routes/feedback.ts`

What they do:
- create customer feedback
- prevent duplicate feedback for the same order
- manage POS feedback for internal issues
- summarize customer satisfaction

Business meaning:
- collects customer experience ratings.
- captures operational issues from staff.
- gives management a view of service quality.

### 5.12 Reports
Files:
- `controllers/reportsController.ts`
- `services/reportsService.ts`
- `routes/reports.ts`

What they do:
- show summary data
- show daily revenue
- show low-stock alerts
- show top-selling items
- show customer satisfaction metrics

Business meaning:
- gives managers business intelligence.
- helps with decisions on sales, stock, and quality.

### 5.13 Orders
Files:
- `controllers/orderController.ts`
- `services/orderService.ts`
- `routes/orders.ts`

What they do:
- create orders
- view orders
- update order status
- add and remove items
- update payment
- cancel orders

Business meaning:
- this is the main sales workflow of the coffee shop.
- POS and managers use it for dine-in, takeaway, and delivery orders.

### 5.14 Menu
Files:
- `controllers/menuController.ts`
- `services/menuService.ts`
- `routes/menu.ts`

What they do:
- manage menu items
- toggle availability
- create, edit, and delete products

Business meaning:
- controls which drinks and food can be sold.
- keeps the customer-facing catalog current.

---

## 6. Frontend Detailed Structure

### Frontend tree
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
- `src/main.tsx`: React bootstrap file.
- `src/App.tsx`: app routing, protected routes, and page mounting.
- `src/layouts/DashboardLayout.tsx`: shared sidebar and content shell.
- `src/contexts/AuthContext.tsx`: client auth state and session helpers.
- `src/services/api.ts`: Axios API client and endpoint helpers.

### Frontend file-by-file index

#### `frontend/src/main.tsx`
React entry point.
- renders the app into the root DOM node
- loads global styles

Business meaning:
- starts the UI in the browser.

#### `frontend/src/App.tsx`
Main route map.
- connects pages to routes
- wraps protected pages in auth checks
- organizes manager and staff access

Business meaning:
- decides which screen appears for each URL and role.

#### `frontend/src/contexts/AuthContext.tsx`
Auth state provider.
- stores current user
- tracks login status
- handles logout

Business meaning:
- keeps user session information available across the app.

#### `frontend/src/layouts/DashboardLayout.tsx`
Shared application shell.
- renders the sidebar
- shows the user name and role
- provides the outlet for nested pages

Business meaning:
- gives the app its consistent navigation and workspace layout.

#### `frontend/src/services/api.ts`
Shared Axios client.
- injects access tokens into requests
- refreshes tokens when needed
- exposes grouped API helpers like `ordersAPI`, `inventoryAPI`, `feedbackAPI`, `reportsAPI`

Business meaning:
- all browser-to-server communication goes through this file.

---

## 7. Frontend Pages and Their Meaning

### `LoginPage.tsx`
- Sign-in screen.
- Meaning: authenticate a user and start a session.

### `ManagerDashboard.tsx`
- Manager landing page.
- Meaning: quick access to management modules and metrics.

### `POSDashboard.tsx`
- POS operator dashboard.
- Meaning: order handling and cashier workflow.

### `StaffDashboard.tsx`
- Staff landing page.
- Meaning: personal work-related access and shortcuts.

### `OrdersPage.tsx`
- Order management screen.
- Meaning: create and operate customer orders.

### `MenuPage.tsx`
- Menu maintenance screen.
- Meaning: manage visible menu products.

### `StaffManagement.tsx`
- Employee management screen.
- Meaning: managers can maintain staff accounts.

### `ScheduleManagement.tsx`
- Schedule planning screen.
- Meaning: manage shifts and approvals.

### `AttendanceManagement.tsx`
- Attendance screen.
- Meaning: staff check in/out and managers review attendance.

### `LeaveManagement.tsx`
- Leave request screen.
- Meaning: staff request time off and managers approve it.

### `InventoryManagement.tsx`
- Inventory control screen.
- Meaning: manage stock, low-stock alerts, and item records.

### `EquipmentManagement.tsx`
- Equipment management screen.
- Meaning: track equipment condition, maintenance, and warranty.

### `PromotionsManagement.tsx`
- Promotions screen.
- Meaning: create discounts and apply offers to orders.

### `TableManagement.tsx`
- Seating management screen.
- Meaning: manage table availability, capacity, and QR codes.

### `CustomerFeedback.tsx`
- Customer feedback screen.
- Meaning: collect and review order-based feedback.

### `ReportsAnalytics.tsx`
- Analytics dashboard screen.
- Meaning: show revenue, top items, stock alerts, and satisfaction data.

---

## 8. Frontend Styles and Supporting Files

### `frontend/index.html`
- SPA entry HTML page.
- Meaning: the browser loads React from this shell file.

### `frontend/nginx.conf`
- Nginx static hosting config.
- Meaning: supports React Router refreshes in deployment.

### `frontend/Dockerfile`
- Production frontend build container.
- Meaning: builds the app and serves it with Nginx.

### `frontend/src/styles/`
- Shared CSS assets.
- Meaning: app-wide styling and theme rules.

---

## 9. API Function Meaning by Business Domain

### Authentication
- Login, refresh, logout, and current user.
- Meaning: secure access to the system.

### User management
- Manage employee accounts and roles.
- Meaning: control who can use which parts of the system.

### Scheduling
- Create and approve work schedules.
- Meaning: assign shifts and coordinate staffing.

### Attendance
- Check in and out for work.
- Meaning: record work hours and punctuality.

### Salary
- Calculate payroll from attendance.
- Meaning: automate monthly employee compensation.

### Leave
- Request and approve time off.
- Meaning: manage absence and staffing coverage.

### Orders
- Create and update sales orders.
- Meaning: run customer transactions.

### Menu
- Manage product catalog.
- Meaning: control what can be sold.

### Inventory
- Add and remove stock.
- Meaning: monitor ingredients and supplies.

### Equipment
- Track machines and maintenance.
- Meaning: keep equipment reliable.

### Promotions
- Create discounts and apply them to orders.
- Meaning: support marketing and sales promotions.

### Tables
- Manage seating tables.
- Meaning: support dine-in operations.

### Feedback
- Collect customer and staff feedback.
- Meaning: improve service and internal operations.

### Reports
- Summarize sales and operations.
- Meaning: help managers make informed decisions.

### Smoke testing
- Run endpoint checks automatically.
- Meaning: validate that the system is alive after setup or deployment.

### Deployment
- Dockerize backend, frontend, and database.
- Meaning: make the app reproducible and ready to run in one command.

---

## 10. Database-Driven Meaning

The database schema supports the web app functions above:
- `USERS`: login and staff data
- `SCHEDULES`: shifts and approvals
- `ATTENDANCE`: check-in/check-out records
- `SALARY`: payroll calculations
- `LEAVE_REQUESTS`: time-off workflow
- `TABLES`: seating management
- `ORDERS` and `ORDER_ITEMS`: sales workflow
- `MENU_ITEMS`: products sold
- `INVENTORY`: stock tracking
- `EQUIPMENT`: asset tracking
- `POS_FEEDBACK` and `FEEDBACK`: operational and customer feedback
- `PROMOTIONS`: discount campaigns

Reporting views turn raw data into business metrics:
- `daily_revenue`
- `low_stock_alert`
- `top_selling_items`
- `customer_satisfaction`

---

## 11. Runtime Flow
1. Browser opens the frontend.
2. User logs in.
3. AuthContext stores the session state.
4. Protected routes show the correct pages.
5. Pages call the API client.
6. API client sends requests to the backend.
7. Route handlers pass the request to controllers.
8. Controllers validate data and call services.
9. Services interact with MySQL.
10. Data returns to the UI and updates the page.

---

## 12. Deployment View
- `docker-compose.yml` runs the full stack.
- `backend/Dockerfile` builds the API.
- `frontend/Dockerfile` builds the React UI.
- `frontend/nginx.conf` supports SPA routing.
- `DEPLOYMENT_GUIDE.md` explains how to run it.

---

## 13. Short Summary
This repository is a service-oriented full-stack application.

Backend files answer:
- what the API should do
- how data is validated
- how database rules work

Frontend files answer:
- what the user sees
- what actions the user can do
- how the browser talks to the API

Together, they implement the full coffee shop management workflow.
