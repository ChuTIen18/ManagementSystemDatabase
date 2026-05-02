# Deployment Guide

## Goal
Provide a reproducible production-style deployment for the Coffee House Management System.

## Included Deployment Setup
- MySQL 8.0 container with auto-initialized schema
- Backend API container on port `3000`
- Frontend Nginx container on port `8080`
- SPA routing support for React Router

## Prerequisites
- Docker Desktop installed and running
- Ports `3306`, `3000`, and `8080` available

## Quick Start
From the repository root:

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:8080
- Backend health: http://localhost:3000/health

## Environment Notes
The compose file uses these production defaults:
- MySQL host: `db`
- Backend port: `3000`
- Frontend API base URL: `http://localhost:3000/api/v1`
- CORS origin: `http://localhost:8080`

Before deploying outside local development, replace these secrets:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- Database root password

## Build Outputs
- Backend builds TypeScript into `dist/`
- Frontend builds static assets into `dist/` and serves them from Nginx

## Schema Initialization
On first startup, MySQL runs:
- `docs/database_schema.sql`
- `docs/setup_test_users.sql`

If you need to reset the database, remove the Docker volume and start again.

```bash
docker compose down -v
docker compose up --build
```

## Verification Checklist
- Backend container starts without database connection errors
- Frontend loads and can reach the backend API
- Login works with the seeded users
- Orders, inventory, feedback, and reports pages render correctly
- React Router refresh works on nested routes

## Troubleshooting
- If MySQL initialization fails, remove the volume and rerun compose.
- If frontend shows API errors, confirm `VITE_API_BASE_URL` points to `http://localhost:3000/api/v1`.
- If backend cannot connect to MySQL, ensure the database service finished initialization before retrying.
