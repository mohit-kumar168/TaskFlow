# TaskFlow — Backend

This folder contains the TaskFlow backend: an Express + TypeScript API using Prisma and PostgreSQL.

The backend implements authentication, organizations, workspaces, projects, boards/columns (auto-created on project creation), and issue management. The codebase is modular (services, repositories, validators and routes) and uses JWT cookies for authentication.

## Features ⚙️

- Credential-based authentication (register, login, logout, refresh token).
- Access and refresh JWT tokens stored in cookies; password hashing with bcrypt.
- User profile endpoints: `me`, `update profile`, `change password`, `delete user`.
- Organization CRUD and invitation flow (create, list, fetch, update, archive, invite, accept invite).
- Workspace CRUD under organizations and member management (create, list, fetch, update, archive, members).
- Project CRUD within workspaces, automatic board creation and default columns, and project member management.
- Issue CRUD with priorities, statuses, assignment checks, and ordering within board columns.
- Request validation middleware (Zod schemas) and an authentication middleware for protected routes.

Only backend functionality is documented here — frontend has been separated and may change.

## Tech Stack

- Node.js (Bun runtime)
- TypeScript
- Express
- PostgreSQL (pg)
- Prisma ORM
- JWT for auth, bcrypt for password hashing
- Zod for request validation

## Project layout

Top-level backend layout:

```
backend/
├─ src/
│  ├─ modules/        // auth, organizations, workspaces, projects, issues, ...
│  ├─ prisma/         // prisma client
│  ├─ config/         // env, db, logger
│  ├─ middleware/     // auth, error, validation
│  └─ utils/          // apiError, apiResponse, jwt, password helpers
├─ prisma/            // schema.prisma and migrations
├─ .env               // example environment file
├─ package.json
└─ tsconfig.json
```

Important code locations:

- `src/modules/auth` — auth routes, controller, service, repository, validators
- `src/modules/organization` — organization CRUD, invites, members
- `src/modules/workspaces` — workspace CRUD and members
- `src/modules/projects` — project CRUD, board bootstrap, project members
- `src/modules/issues` — issue CRUD and business logic
- `src/prisma/schema.prisma` and `prisma/migrations` — DB schema and migrations

## Installation

Prerequisites:

- Bun (used to run scripts in this repo)
- PostgreSQL (or a managed Postgres instance)

Quick start:

```bash
cd backend
bun install
# create and edit .env (see Environment Variables below)
# generate prisma client (if needed)
# using npm/npx if Prisma CLI isn't available under Bun:
npx prisma generate
# run migrations (if you need to apply them):
npx prisma migrate deploy
# start in dev (watch) mode:
bun run dev
```

Notes:

- The repository already contains `prisma/migrations`. Use `prisma migrate deploy` in environments where you want to apply existing migrations.
- If you prefer `bunx` for CLI commands: `bunx prisma generate` / `bunx prisma migrate deploy`.

## Environment variables

Create a `backend/.env` file (there is an example in the repo). Key variables used by the code include:

```
DATABASE_URL            # Postgres connection string (required)
DIRECT_URL              # (optional) direct DB URL used for migrations
NODE_ENV                # development | production
PORT                    # server port (default 8000)
FRONTEND_URL            # allowed origin for CORS
BCRYPT_SALT_ROUNDS      # bcrypt cost (default 10)
ACCESS_TOKEN_SECRET     # JWT access secret (required)
ACCESS_TOKEN_EXPIRES_IN # e.g. 15m or 1d
REFRESH_TOKEN_SECRET    # JWT refresh secret (required)
REFRESH_TOKEN_EXPIRES_IN# e.g. 7d
```

The repository includes a `.env` with example values — verify and update before running in your environment.

## Scripts

Run from the `backend` directory:

```bash
bun run dev    # start server with watch (development)
bun run start  # start server (production)
```

## API overview

All backend routes are mounted under `/api` (see `src/app.ts`). Below is a concise overview of implemented endpoints and their purpose.

| Base path | Methods | Purpose |
|---|---:|---|
| `/api/auth` | `POST /register` | Register with credentials |
|  | `POST /login` | Login and set auth cookies |
|  | `POST /refresh-token` | Refresh JWT tokens |
|  | `POST /logout` | Logout (protected) |
|  | `GET /me` | Get current user (protected) |
|  | `PATCH /change-password` | Change password (protected) |
|  | `PATCH /update-profile` | Update profile (protected) |
|  | `DELETE /delete-user` | Soft-delete user (protected) |
| `/api/organizations` | `POST` | Create organization (protected) |
| `/api/organizations/:slug` | `GET`, `PATCH`, `DELETE` | Fetch, update, archive organization |
| `/api/organizations/:slug/invite` | `POST` | Invite member to organization |
| `/api/organizations/:slug/accept/:token` | `POST` | Accept organization invite (protected) |
| `/api/organizations/:slug/members` | `GET`,`PATCH`,`DELETE` | Organization members management |
| `/api/organizations/:organizationSlug/workspaces` | `POST`,`GET` | Workspace CRUD under organization (protected) |
| `/api/organizations/:organizationSlug/workspaces/:slug` | `GET`,`PATCH`,`DELETE` | Workspace fetch/update/archive (protected) |
| `/api/workspaces/:workspaceId/projects` | `POST`,`GET` | Create/list projects (protected) |
| `/api/workspaces/:workspaceId/projects/:projectId` | `GET`,`PATCH`,`DELETE` | Project fetch/update/archive (protected) |
| `/api/projects/:projectId/issues` | `POST`,`GET` | Issue create/list (protected) |
| `/api/projects/:projectId/issues/:issueId` | `GET`,`PATCH`,`DELETE` | Issue fetch/update/archive (protected) |

Notes:

- Project creation bootstraps a `Board` and default columns (`Todo`, `In Progress`, `In Review`, `Done`).
- Issue creation places new issues into the board's `Todo` column and generates a project-scoped issue code (e.g. `PROJ-1`).
- Routes use Zod validators (where present) to validate request payloads.

## Tests

There are no automated tests included in the repository at the time of writing. Adding unit and integration tests is recommended.

## AI authorship heuristic (rough estimate)

You asked for an "AI score" — how much code was written with AI. I cannot deterministically know which files were authored by humans vs. AI from source alone. I ran a small heuristic scan for explicit AI markers (strings such as `copilot`, `chatgpt`, `openai`, or comments like `generated by`) in the backend `src` tree. Results:

- Files scanned: 45
- Files matching AI-related markers: 0 (Prisma-generated files were excluded from AI heuristics; they are marked `"code generated by Prisma"`).

Heuristic AI score: 0% of files contained explicit AI markers.

Limitations: this is only a coarse heuristic — absence of these markers does not guarantee code wasn't authored or assisted by AI. For a more accurate audit, you can:

- Inspect commit history for messages referencing Copilot/ChatGPT/AI.
- Provide a list of files you know were AI-assisted and I can compute a precise percentage.

If you want, I can run a commit-history scan or other heuristics next — tell me which approach you prefer.

## Next steps / Suggestions

- Add a `backend/.env.example` with the required vars and safe example values.
- Add basic integration tests for auth and membership flows.
- Document database migration steps and CI integration for `prisma migrate deploy`.


