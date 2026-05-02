# Testing Guide

## Scope
This guide covers the new features added in Tasks 18-20:
- Customer feedback
- Reports and analytics
- Smoke testing

## Backend Smoke Test
Run the smoke test after starting the backend server.

```bash
cd backend
npm run smoke:test
```

If you want authenticated report checks, provide a bearer token:

```bash
cd backend
set ACCESS_TOKEN=your_jwt_token
npm run smoke:test
```

## Manual Validation Checklist
- Create a customer feedback entry for a completed order.
- Confirm duplicate feedback for the same order is rejected.
- Open the reports dashboard as manager and verify summary cards render.
- Confirm low-stock, top-items, and satisfaction data load from the API.
- Check that manager-only routes are blocked for non-manager users.

## Expected API Coverage
- `GET /api/v1/feedback/customer/summary`
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/daily-revenue`
- `GET /api/v1/reports/low-stock`
- `GET /api/v1/reports/top-items`
- `GET /api/v1/reports/customer-satisfaction`

## Notes
- The reports endpoints require manager access.
- The smoke test uses the existing `tsx` runtime already present in the backend project.
- If the database has no completed orders or feedback yet, some report values may be zero or empty.
