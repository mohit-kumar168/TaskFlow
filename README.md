# TaskFlow (Repository)

This repository currently focuses on the backend implementation of TaskFlow. The backend is a modular Express + TypeScript API that uses Prisma with PostgreSQL. The frontend lives in `frontend/` but is actively being reworked; this top-level README now documents the backend-first architecture and usage.

## What this README covers

- Backend architecture and modules
- Installation and run instructions for the backend
- Environment variables required by the backend
- Concise API overview (implemented endpoints)

If you need a combined frontend + backend README, tell me once the frontend is stable and I will update this file accordingly.

## Architecture (backend-focused)

- Modular service layer: `src/modules/*` contains self-contained modules (auth, organization, workspaces, projects, issues).
- Repository layer for database access (Prisma) per module.
- Zod validators and request validation middleware.
- Cookie-based JWT authentication (access + refresh tokens).
- Prisma client with `@prisma/adapter-pg` and a PostgreSQL connection pool.

## Implemented backend modules

- `auth` — credential auth, token refresh, profile, change password, delete user
- `organization` — org create/update/archive, invites, members
- `workspaces` — workspace CRUD under organizations, member management
- `projects` — project CRUD, automatic board and default columns bootstrap, project members
- `issues` — issue CRUD, priority/status validation, assignment checks, ordering within columns

Other folders exist for attachments, comments, notifications, reports and sprints; some are in-progress. Inspect `src/modules/*` to see current implementation status for each.

## Tech stack

- Bun (runtime) — used in `package.json` scripts
- Node.js + TypeScript
- Express
- Prisma + `@prisma/adapter-pg`
- PostgreSQL
- Zod, bcrypt, jsonwebtoken

## Quick start (backend)

1. Install dependencies

```bash
cd backend
bun install
```

2. Configure environment variables (see next section)

3. Generate Prisma client and apply migrations (if needed)

```bash
npx prisma generate
npx prisma migrate deploy
```

4. Run development server (watch)

```bash
bun run dev
```

Run production start:

```bash
bun run start
```

Notes: If `bun` does not provide Prisma CLI on your system, use `npx`/`npm` as shown above.

## Environment variables (backend)

Create `backend/.env`. Key variables used by the backend code:

```
DATABASE_URL            # required, Postgres connection string
DIRECT_URL              # optional, used for migrations
NODE_ENV                # development | production
PORT                    # server port (default 8000)
FRONTEND_URL            # CORS origin
BCRYPT_SALT_ROUNDS      # bcrypt cost (default 10)
ACCESS_TOKEN_SECRET     # JWT access secret (required)
ACCESS_TOKEN_EXPIRES_IN # e.g. 15m or 1d
REFRESH_TOKEN_SECRET    # JWT refresh secret (required)
REFRESH_TOKEN_EXPIRES_IN# e.g. 7d
```

There is a `backend/.env` in the repo with example values. Verify and replace secrets before deploying.

## Routes / API (concise)

Base routes are registered in `src/app.ts` under `/api`.

Implemented resource groups (examples):

- `/api/auth` — register, login, refresh-token, logout, me, change-password, update-profile, delete-user
- `/api/organizations` — create, list, fetch, update, archive, invite, accept-invite, members
- `/api/organizations/:organizationSlug/workspaces` — create/list workspaces under an organization
- `/api/workspaces/:workspaceSlug` — workspace fetch/update/archive and member management
- `/api/workspaces/:workspaceId/projects` — create/list projects (project creation bootstraps a board and default columns)
- `/api/workspaces/:workspaceId/projects/:projectId` — project fetch/update/archive and project member management
- `/api/projects/:projectId/issues` — create/list issues (issues are placed in `Todo` column by default)
- `/api/projects/:projectId/issues/:issueId` — issue fetch/update/archive

See `src/modules/*/*.routes.ts` for exact endpoints and expected payloads.

## Development notes & suggestions

- Add `backend/.env.example` to the repo with non-sensitive example values.
- Add integration tests for auth and membership flows.
- Document CI steps for `prisma migrate deploy` to keep DB migrations repeatable.

## Backend README

There is a more detailed backend README at `backend/README.md` which documents environment variables, API overview, and a small AI-authorship heuristic scan.
