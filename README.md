# ServiceDesk — Employee Service Request System

A full-stack employee support portal that helps organizations manage internal IT, HR, and Facilities requests through a centralized workspace. Employees can raise service requests, track progress, and review updates, while authorized support staff can manage and resolve requests.

## Overview

ServiceDesk is designed to simplify internal support operations by bringing request creation, status tracking, and support workflows into one application.

The application includes an employee dashboard, request management interface, authentication, and a backend designed to work with a PostgreSQL database.

## Key Features

### Employee Workspace
- User registration and login.
- Authenticated access to the employee workspace.
- Dashboard with request statistics.
- Create and view service requests.
- Track request status and progress.
- Search and filter requests where supported.
- View request details and activity history where available.

### Request Management
- Create requests for internal support needs.
- Categorize requests, such as IT, HR, and Facilities, where configured.
- Record request descriptions and priority.
- Track request status throughout the support process.
- Associate requests with their creators.

### Support and Administration
- Role-based access control for protected operations.
- Support-oriented request management.
- Assignment and status updates where enabled by the configured role permissions.
- Request activity records and SLA-related indicators where implemented.

### Security and Reliability
- JWT-based authentication.
- Password hashing using bcrypt.
- Server-side request validation.
- Environment-based configuration.
- PostgreSQL database integration.
- Structured API error handling where configured.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| API Style | REST |
| Development Tools | Git, GitHub, npm, VS Code |

## Application Architecture

The application follows a client-server architecture.

1. The React frontend provides the employee and support interfaces.
2. The frontend communicates with the Express backend through HTTP API requests.
3. The backend validates requests and enforces authentication and authorization.
4. PostgreSQL stores application data.
5. JWTs are used to authenticate protected API requests.

```text
Employee / Support User
          |
          v
 React + Vite Frontend
          |
          | HTTP / REST API
          v
 Node.js + Express Backend
          |
          | Database Queries
          v
      PostgreSQL
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Git
- A code editor such as Visual Studio Code

Verify the Node.js and npm installations:

```bash
node --version
npm --version
```

## Project Structure

The exact folder structure may vary by version. A typical layout is:

```text
ServiceDesk/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   └── migrate.js
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

Keep environment files and credentials out of version control.

## Installation and Setup

### 1. Clone the repository

Replace the placeholder with your actual GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ServiceDesk
```

### 2. Configure the backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create the environment file at the location expected by the backend configuration. If the backend loads `.env` from its own directory, create `backend/.env`.

Example:

```env
DATABASE_URL=postgresql://postgres:<YOUR_DATABASE_PASSWORD>@localhost:5432/servicedesk
JWT_SECRET=<YOUR_STRONG_RANDOM_SECRET>
PORT=5000
```

Replace the placeholders with your local configuration. Do not commit real passwords or JWT secrets.

If the application uses additional environment variables, configure them according to the backend source code.

### 3. Create the PostgreSQL database

Open SQL Shell (`psql`) or connect through pgAdmin.

Create the database if it does not already exist:

```sql
CREATE DATABASE servicedesk;
```

If the database already exists, skip this command.

Ensure the PostgreSQL username, password, host, and port in `DATABASE_URL` match your local installation.

### 4. Run database migrations

From the backend directory:

```bash
npm run migrate
```

This command requires the migration script and its dependencies to be configured in the backend `package.json`.

If the command fails, check the database connection string, `.env` location, PostgreSQL service, and migration output.

### 5. Start the backend

From the backend directory:

```bash
npm run dev
```

If the project does not define a `dev` script, use the start command specified in the backend `package.json`.

The backend in the local development setup may use:

```text
http://localhost:5000
```

Use the actual port printed by your server.

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

```text
http://localhost:5173
```

Keep both frontend and backend terminals running during development.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Backend listening port, if supported |

Use a unique, randomly generated JWT secret in each environment. If a credential has been exposed, rotate it before using the project beyond local development.

## Application Workflow

1. An employee registers or signs in.
2. The employee opens the workspace dashboard.
3. The employee creates a service request.
4. The request is stored through the backend.
5. The employee views the request and tracks its status.
6. Authorized support staff can manage requests according to their assigned permissions.
7. The employee checks for updates and resolution progress.

The exact categories, status transitions, and administrative actions depend on the implementation and role configuration.

## API Overview

The backend exposes REST endpoints for application operations.

Typical API areas include:

| API Area | Purpose |
|---|---|
| Authentication | Registration and login |
| User / Profile | Authenticated user information |
| Requests | Create and retrieve service requests |
| Request Management | Update or assign requests where authorized |
| Health | Service health checks, if configured |

Example local health-check URL, if implemented:

```text
http://localhost:5000/health
```

The exact routes, HTTP methods, request bodies, response formats, and access requirements should be documented from the actual backend route files. Do not assume that every endpoint listed above is available.

## Security Considerations

- Store passwords as secure hashes rather than plaintext.
- Protect private API endpoints with authentication.
- Enforce authorization on the server, not only in the frontend.
- Keep `.env` and other secret files out of Git.
- Use strong JWT secrets and rotate exposed credentials.
- Validate and sanitize user-controlled input.
- Use HTTPS and production-grade configuration when deploying.
- Avoid placing passwords, tokens, or sensitive personal data in logs.

## Testing and Verification

Before submission, verify the following workflows:

- [ ] Backend starts successfully.
- [ ] Frontend starts successfully.
- [ ] PostgreSQL connection works.
- [ ] Database migrations complete successfully.
- [ ] Registration and login work.
- [ ] Invalid credentials are rejected.
- [ ] Authenticated users can create service requests.
- [ ] Requests remain available after a page refresh.
- [ ] Dashboard statistics reflect saved requests.
- [ ] Request details and status tracking work.
- [ ] Role-based restrictions are enforced by the backend.
- [ ] Authorized support actions work, if implemented.
- [ ] Validation and error handling behave as expected.

Record actual results and screenshots as submission evidence. Do not mark a test as passed unless it has been performed.

## Troubleshooting

### `DATABASE_URL loaded: false`

Check that `.env` exists in the directory from which the application loads environment variables. Confirm that the backend initializes its environment configuration before accessing `process.env.DATABASE_URL`.

### PostgreSQL role does not exist

Verify the PostgreSQL username in `DATABASE_URL`. It must match an existing database role.

### Database connection fails

Confirm that PostgreSQL is running and that the database name, credentials, host, and port are correct.

### Frontend cannot connect to the backend

Confirm that the backend is running, the frontend API base URL points to the correct server, and CORS is configured appropriately.

### Login fails

Verify that the account exists in the database, the password matches, and the frontend is sending the expected fields to the configured login endpoint.

### `Cannot GET /`

An Express API may not define a homepage route at `/`. Test an actual configured API endpoint instead.

## Future Enhancements

Potential future improvements include:

- Email and in-app notifications.
- Advanced SLA monitoring and escalation.
- File attachments for service requests.
- Advanced search, filters, and reporting.
- Analytics dashboards for support teams.
- Automated integration and end-to-end tests.
- Docker-based development and deployment.
- CI/CD automation and production deployment.

These are proposed enhancements, not claims that every feature is already implemented.

## Project Information

**Project:** ServiceDesk — Employee Service Request System  
**Type:** Full-stack web application  
**Purpose:** Internal employee support and request management  
**Status:** Local development and workflow testing

**Developer:** Nirbhay 
**GitHub:** https://github.com/Nirbhay-tech/servicedesk-employee-service-request-system.git

## License

Choose and add a license appropriate for your intended use before distributing the project publicly.
