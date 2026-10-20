# API Testing Checklist

Base URL: `http://localhost:5000`

## 1. Health check
`GET /health` → `200 { "status": "ok", ... }`

## 2. Register an employee
`POST /api/auth/register`
```json
{"name":"Demo Employee","email":"employee@example.com","password":"ChangeMe123!","department":"IT"}
```
Expected: `201`, user object and JWT. Save the token locally for the following calls.

## 3. Create a request
`POST /api/requests` with `Authorization: Bearer <employee-token>`
```json
{"category":"IT","title":"VPN access issue","description":"I cannot connect to the company VPN from my work laptop.","priority":"high"}
```
Expected: `201`, generated request number and SLA due date.

## 4. Confirm employee scope
`GET /api/requests` with employee token → only requests created by that employee.
`GET /api/requests/metrics` with employee token → `403`.
`PATCH /api/requests/1/status` with employee token → `403` (assuming request ID exists).

## 5. Test staff flow
In a local development database only, promote a separate test account:
```sql
UPDATE users SET role='support' WHERE email='support@example.com';
```
Log in again to receive a token containing the updated role. Verify staff can list all requests, view metrics, assign a support owner, and update status. Confirm the activity is recorded in `request_activity`.

## 6. Validation checks
- Missing title / title shorter than 5 characters → `400`.
- Invalid category or priority → `400`.
- Duplicate registration email → `409`.
- Missing/invalid bearer token → `401`.
- Employee attempts staff-only operation → `403`.
- Unknown request ID → `404`.

Use a local test database and synthetic data only. Do not publish tokens, passwords, or `.env` values in screenshots or GitHub.
