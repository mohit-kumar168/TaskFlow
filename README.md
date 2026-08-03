# TaskFlow

TaskFlow is a Jira/Asana-inspired project management application designed to manage workspaces, projects, and issue tracking. The backend for the current MVP has been implemented, while the frontend is under active development.

## Architecture Overview

- Multi-workspace architecture
- RESTful API
- JWT-based authentication
- Prisma ORM with PostgreSQL

## Implemented Features

- Credential-based authentication with register, login, logout, token refresh, and current-user endpoints.
- JWT authentication using access and refresh tokens stored in cookies.
- Workspace creation, listing, retrieval, archiving, and member management.
- Project creation, listing, retrieval, update, archiving, and member management.
- Automatic board creation when a project is created.
- Automatic default column creation for new boards: Todo, In Progress, In Review, and Done.
- Issue creation, listing, retrieval, update, and archiving.
- Basic issue assignment validation against project membership.
- Protected backend routes for authenticated users.
- Frontend auth pages, auth state bootstrap, and a protected dashboard route.


## Tech Stack

| Area | Stack |
| --- | --- |
| Frontend | React, TypeScript, React Router, Zustand, React Hook Form, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| Authentication | JWT, bcrypt, cookie-based session tokens |
| Tooling | Bun, Biome |

## Project Structure

| Path | Purpose |
| --- | --- |
| [backend/](backend) | Express API, Prisma schema, controllers, routes, middleware, and generated Prisma client |
| [frontend/](frontend) | React application, auth flow, route protection, and UI scaffolding |
| [docs/Project_Plan.md](docs/Project_Plan.md) | Project planning notes |

### Backend Layout

| Path | Purpose |
| --- | --- |
| [backend/src/app.ts](backend/src/app.ts) | Express app setup and route registration |
| [backend/src/server.ts](backend/src/server.ts) | Server entry point |
| [backend/src/config/](backend/src/config) | Database, environment, and logger setup |
| [backend/src/controllers/](backend/src/controllers) | Request handlers for auth, workspaces, projects, and issues |
| [backend/src/routes/](backend/src/routes) | API route definitions |
| [backend/src/middleware/](backend/src/middleware) | Auth and error handling middleware |
| [backend/prisma/schema.prisma](backend/prisma/schema.prisma) | Database schema |

### Frontend Layout

| Path | Purpose |
| --- | --- |
| [frontend/src/App.tsx](frontend/src/App.tsx) | Application root |
| [frontend/src/routes/](frontend/src/routes) | Route configuration and protection |
| [frontend/src/pages/](frontend/src/pages) | Login, register, and dashboard screens |
| [frontend/src/api/](frontend/src/api) | Axios client and auth API helpers |
| [frontend/src/store/auth.store.ts](frontend/src/store/auth.store.ts) | Authentication state |

## Installation

### Prerequisites

- Bun
- PostgreSQL

### Backend

```bash
cd backend
bun install
```

### Frontend

```bash
cd frontend
bun install
```

## Environment Variables

### Backend

Create a `backend/.env` file with the values your local environment needs.

| Variable | Purpose | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma | `postgresql://user:password@localhost:5432/taskflow` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `PORT` | API port | `8000` |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost | `10` |
| `ACCESS_TOKEN_SECRET` | Secret for access tokens | `TODO` |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | `TODO` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime | `7d` |

### Frontend

Create a `frontend/.env` file.

| Variable | Purpose | Example |
| --- | --- | --- |
| `BUN_PUBLIC_BASE_URL` | Base URL for API requests | `http://localhost:8000` |

## Running the Project

### Backend

```bash
cd backend
bun run dev
```

To start without watch mode:

```bash
cd backend
bun run start
```

### Frontend

```bash
cd frontend
bun run dev
```

To build the frontend:

```bash
cd frontend
bun run build
```

## API Modules

- Authentication
- Workspace Management
- Project Management
- Issue Management

Notes:

- Project creation automatically creates a board and four default columns.
- Issue creation assigns new issues to the `Todo` column by default.
- Workspace and project access are enforced through membership checks.

## Current Progress

- Backend implementation is complete for the features listed above.
- Frontend work is in progress.
- The current frontend includes auth screens, auth bootstrapping, and a protected dashboard route, but the dashboard itself is still a placeholder.

## Roadmap

- Add board and column management APIs.
- Add comments and activity tracking.
- Build the dashboard and project views in the frontend.
- Add issue detail and board UI.

## Planned Features

- Kanban Board UI
- Comments
- Activity Timeline
- Dashboard
- Search & Filters