# TaskFlow

TaskFlow is a full-stack project management application for organizing work across organizations, workspaces, and projects. It provides a React dashboard backed by a modular Express API, with PostgreSQL persistence through Prisma.

The repository is split into two independently runnable applications:

```text
TaskFlow/
├── backend/    Express + TypeScript API, Prisma schema, and migrations
├── frontend/   React dashboard built and served with Bun
└── docs/       Project planning documentation
```

## Current features

The application currently includes:

- Credential authentication with access and refresh tokens stored in cookies.
- Google OAuth support.
- User profile and security settings.
- Organizations, invitations, members, and organization settings.
- Workspaces with members, settings, and project creation.
- Projects with automatically initialized boards and default columns.
- Issues with priorities, statuses, assignment, ordering, comments, and attachments.
- Sprints with planning, start, completion, and incomplete-issue handling.
- Notifications and project reports with issue and sprint charts.
- Search and dashboard views.

## Technology

### Backend

- Bun and TypeScript
- Express 5
- Prisma 7 with PostgreSQL
- Zod request validation
- JWT cookies, bcrypt, and Google OAuth
- Cloudinary for uploaded assets
- Pino logging and Helmet security middleware

### Frontend

- Bun
- React 19 and React Router 7
- TypeScript
- Tailwind CSS 4
- Zustand for client state
- Axios for API requests
- Recharts for reports
- Lucide React for icons

## Prerequisites

- [Bun](https://bun.sh/)
- PostgreSQL
- A Cloudinary account for uploads
- Google OAuth credentials for Google sign-in

## Setup

Install dependencies in both applications:

```bash
cd backend
bun install

cd ../frontend
bun install
```

### Backend environment

Create `backend/.env` with the variables required by `backend/src/config/env.ts`:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
BCRYPT_SALT_ROUNDS=10
ACCESS_TOKEN_SECRET="replace-me"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="replace-me"
REFRESH_TOKEN_EXPIRES_IN="7d"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

`FRONTEND_URL` may also be needed when the frontend is served from a different origin, because the API uses it for CORS. Do not commit real secrets.

Generate the Prisma client and apply the committed migrations:

```bash
cd backend
bunx prisma generate
bunx prisma migrate deploy
```

### Frontend environment

Create `frontend/.env` with the API URL and the browser-safe Google client ID:

```env
BUN_PUBLIC_BASE_URL=http://localhost:8000/api
BUN_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

The frontend API client sends cookies with requests, so the backend `FRONTEND_URL` must match the frontend origin when they run on separate origins.

## Running locally

Start the API in one terminal:

```bash
cd backend
bun run dev
```

Start the dashboard in another terminal:

```bash
cd frontend
bun run dev
```

The backend defaults to `http://localhost:8000`. Bun prints the frontend URL when its server starts.

Production commands:

```bash
cd backend && bun run start
cd frontend && bun run build
cd frontend && bun run start
```

The frontend build script accepts Bun build options, for example `bun run build -- --outdir dist`.

## API overview

All API routes are mounted under `/api` in `backend/src/app.ts`:

| Route group | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, Google auth, refresh, logout, profile, and password actions |
| `/api/organizations` | Organizations, invitations, members, and nested workspaces |
| `/api/organizations/:organizationSlug/workspaces` | Workspace operations and nested projects |
| `/api/organizations/:organizationSlug/workspaces/:workspaceSlug/projects` | Projects and nested issues, comments, sprints, and reports |
| `/api/notifications` | User notifications |

All routes other than the public authentication endpoints are protected by the backend auth middleware. See the route files in `backend/src/modules/` for exact methods, parameters, and request schemas.

## Repository layout

```text
backend/src/
├── config/       Environment, database, Cloudinary, and logging setup
├── middleware/   Authentication, validation, uploads, and error handling
├── modules/      Auth, organizations, workspaces, projects, issues, comments,
│                 sprints, notifications, reports, and attachments
├── prisma/       Prisma client setup
└── utils/        JWT, password, token, response, and error helpers

frontend/src/
├── api/          Axios API functions
├── layouts/      Auth, dashboard, workspace, and project layouts
├── modules/      Feature pages, components, and UI
├── routes/       Public and protected React Router routes
└── store/        Zustand stores for application state
```

## Database

The Prisma schema is in `backend/prisma/schema.prisma`, and tracked migrations are in `backend/prisma/migrations`. Use `prisma migrate deploy` for an existing database. For local schema development, use the Prisma workflow appropriate to your database rather than editing generated files under `backend/src/generated/`.

## Testing and status

There are currently no automated test scripts in either package. The fastest manual smoke test is to start both applications, register or sign in, create an organization, create a workspace and project, then create an issue and verify the board, sprint, comment, notification, and report flows.

More backend-specific notes and the API table are available in [backend/README.md](backend/README.md). The product plan is in [docs/Project_Plan.md](docs/Project_Plan.md).
