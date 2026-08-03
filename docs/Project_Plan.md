# Project Planning Notes

This document contains the initial architecture and implementation plan that I used while building the project. It serves as a roadmap and has been updated as development progressed.

# TaskFlow Architecture Blueprint

TaskFlow should be planned as a greenfield SaaS-style project management platform with multiple workspaces per user, a kanban board plus list/detail views, and a backend that can later support realtime collaboration and granular permissions without needing a rewrite. The right approach is to define a clean MVP now, establish the tenancy and data model early, and keep the system modular so the REST API, Prisma schema, and React feature structure can scale with future roadmap items.

## Functional Requirements
- User registration, login, logout, and protected app access.
- Multiple workspaces per user.
- Workspace creation, membership, invitation flow, and settings.
- Project CRUD inside a workspace, including archive and delete.
- Project membership management.
- Board view with customizable columns and drag-and-drop task movement.
- List/detail view for projects and issues.
- Issue CRUD with title, description, status, priority, assignee, reporter, due date, labels, attachments, timestamps.
- Comment CRUD on issues.
- Activity timeline for issue changes.
- User profile view, profile editing, avatar upload, and assigned-task view.
- Dashboard with recent projects, assigned tasks, overdue tasks, and task statistics.
- Search and filter across issues.

## Non-Functional Requirements
- Type-safe frontend and backend with TypeScript.
- Normalized PostgreSQL schema with Prisma ORM.
- Secure auth using JWT and protected routes.
- Scalable modular backend architecture.
- Fast, responsive UI with reusable components.
- Clean validation and centralized error handling.
- Auditable activity tracking for user actions.
- Future-ready design for realtime updates, notifications, and RBAC expansion.
- Maintainable folder boundaries for feature growth.
- Good performance for common board and issue queries.

## User Stories
- As a user, I can register, log in, and access my workspaces securely.
- As a user, I can create and switch between multiple workspaces.
- As a workspace admin, I can invite and manage members.
- As a team member, I can create projects within a workspace.
- As a project member, I can create and update issues on a board or in a list.
- As a user, I can drag tasks between columns and reorder columns.
- As a user, I can assign issues, set priority, and set due dates.
- As a user, I can comment on issues and edit or delete my comments.
- As a user, I can search and filter tasks by key attributes.
- As a user, I can see dashboard summaries of my work.

## Database Schema

**Entities:**
- `User`
- `Workspace`
- `WorkspaceMember`
- `Project`
- `ProjectMember`
- `Board`
- `Column`
- `Issue`
- `Comment`
- `Label`
- `IssueLabel`
- `Attachment`
- `Activity`

**Recommended relationship model:**
- A user can belong to many workspaces.
- A workspace has many members and many projects.
- A project belongs to one workspace and has many members.
- A project has one board and many columns.
- A column has many issues.
- An issue belongs to one project and one column.
- An issue can have many comments, labels, attachments, and activity entries.
- A label belongs to a workspace or project scope, depending on whether you want reusable workspace labels or project-local labels.
- Activity records should capture create, update, move, comment, assign, archive, and delete events.

## Prisma Models
- `User` with auth identity, profile fields, avatar, and timestamps.
- `Workspace` with name, slug, owner, and archival metadata.
- `WorkspaceMember` with `workspaceId`, `userId`, `role`, and membership status.
- `Project` with workspace foreign key, name, key, description, archive flag, and timestamps.
- `ProjectMember` with `projectId`, `userId`, and project role.
- `Board` with `projectId`, name, and configuration fields.
- `Column` with `boardId`, title, order, and optional WIP constraints later.
- `Issue` with project, column, assignee, reporter, priority, status, due date, ordering, and archived/deleted flags.
- `Comment` with issue foreign key, author, content, and edit tracking.
- `Label` with name, color, scope, and timestamps.
- `IssueLabel` as a join table.
- `Attachment` with issue foreign key, file metadata, and uploader.
- `Activity` with actor, entity reference, action type, payload snapshot, and timestamps.

## REST API Design
- **Auth:** `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Users:** `GET /users/me`, `PATCH /users/me`, `GET /users/me/issues`
- **Workspaces:** `GET /workspaces`, `POST /workspaces`, `GET /workspaces/:id`, `PATCH /workspaces/:id`, `DELETE /workspaces/:id`
- **Workspace members:** `GET /workspaces/:id/members`, `POST /workspaces/:id/invites`, `PATCH /workspaces/:id/members/:memberId`, `DELETE /workspaces/:id/members/:memberId`
- **Projects:** `GET /workspaces/:workspaceId/projects`, `POST /workspaces/:workspaceId/projects`, `GET /projects/:id`, `PATCH /projects/:id`, `DELETE /projects/:id`, `POST /projects/:id/archive`
- **Boards and columns:** `GET /projects/:projectId/board`, `POST /projects/:projectId/columns`, `PATCH /columns/:id`, `DELETE /columns/:id`, `POST /projects/:projectId/columns/reorder`
- **Issues:** `GET /projects/:projectId/issues`, `POST /projects/:projectId/issues`, `GET /issues/:id`, `PATCH /issues/:id`, `DELETE /issues/:id`, `POST /issues/:id/move`
- **Comments:** `GET /issues/:issueId/comments`, `POST /issues/:issueId/comments`, `PATCH /comments/:id`, `DELETE /comments/:id`
- **Labels:** `GET /projects/:projectId/labels`, `POST /projects/:projectId/labels`, `PATCH /labels/:id`, `DELETE /labels/:id`
- **Activity:** `GET /issues/:issueId/activity`, `GET /projects/:projectId/activity`
- **Dashboard:** `GET /dashboard/overview`, `GET /dashboard/assigned`, `GET /dashboard/overdue`

## Folder Structure

**Backend:**
```
src/config
src/controllers
src/middleware
src/routes
src/services
src/repositories
src/prisma
src/utils
src/types
src/validators
src/server.ts
```

**Frontend:**
```
src/pages
src/layouts
src/components
src/features
src/hooks
src/services
src/store
src/utils
src/types
src/routes
src/App.tsx
```

## Authentication Flow
- Register and login return authenticated identity plus workspace context.
- Use JWT auth with a secure browser-safe strategy; HTTP-only cookies are the safer default for a SaaS-like app.
- Protect all app routes after auth bootstrap.
- Resolve current user, memberships, and preferred workspace before rendering the main shell.
- Authorization should check both authentication and workspace/project membership.
- Logout should clear the session and reset client state.
- Fine-grained roles should be modeled in membership tables, even if only basic permissions are enforced initially.

## React Component Hierarchy
- `App` sets up providers and routing.
- `AuthLayout` handles unauthenticated pages.
- `AppLayout` handles authenticated navigation and workspace shell.
- `WorkspaceLayout` wraps workspace-scoped screens.
- `ProjectLayout` wraps project-scoped screens.
- `BoardView`, `ListView`, `ProjectOverview`, and `IssueDetail` are the main feature screens.
- Shared UI should include `Sidebar`, `Topbar`, `Modal`, `Drawer`, `Breadcrumbs`, `SearchBar`, `Avatar`, `Badge`, `Button`, `Input`, `Select`, `Tabs`, `Dialog`, `Dropdown`, `Toast`, `Skeleton`, and `EmptyState`.
- Feature components should live under their owning domain rather than in a global shared folder.

## State Management Strategy
- Use TanStack Query for all server state.
- Use React Hook Form plus Zod for forms and validation.
- Use Zustand only for cross-cutting UI state such as sidebar collapse, selected workspace, modal state, and transient filters.
- Avoid duplicating backend data in local state.
- Keep query keys normalized by resource and scope.

## Development Roadmap

1. **Foundation** — Repo scaffold, TypeScript config, linting, env setup, Prisma, PostgreSQL connection, and shared utilities.
2. **Authentication and tenancy** — Register/login/logout, current-user bootstrap, workspace membership, and protected routes.
3. **Workspace and project management** — CRUD flows, workspace switching, project settings, and project membership.
4. **Board and issue core** — Columns, issue CRUD, drag-and-drop, board ordering, and list/detail views.
5. **Collaboration layer** — Comments, labels, attachments, and activity timeline.
6. **Dashboard and profile** — Overview metrics, assigned tasks, overdue tasks, profile editing, and avatar upload.
7. **Hardening and release prep** — Validation, error handling, logging, seed data, performance tuning, and deployment readiness.

## MVP Definition
- **Auth:** register, login, logout, protected routes.
- **Tenancy:** multiple workspaces per user.
- **Workspace:** create and manage workspace.
- **Projects:** create, edit, archive, delete, and manage members.
- **Boards:** default columns plus create, rename, delete, reorder, and drag tasks.
- **Issues:** full CRUD, assignment, priority, due dates, labels, search, filtering.
- **Comments:** CRUD.
- **Profiles:** basic user profile and avatar upload.
- **Dashboard:** recent projects, assigned tasks, overdue tasks, and basic statistics.
- **Activity:** issue history.

**Exclusions from MVP:** notifications, realtime collaboration, sprint management, epics, time tracking, calendar view, analytics dashboard, dark mode, advanced RBAC, email invitations.

## Milestones
- **Milestone 1:** foundation, schema, auth, workspace shell.
- **Milestone 2:** projects and board basics.
- **Milestone 3:** issue detail, comments, labels, activity.
- **Milestone 4:** dashboard, profile, search, polish.
- **Milestone 5:** deployment hardening and future-feature scaffolding.

## Task Breakdown for Jira/Asana
- Epic: Project Foundation
- Epic: Authentication and Access Control
- Epic: Workspaces
- Epic: Projects
- Epic: Boards and Columns
- Epic: Issues
- Epic: Comments and Activity
- Epic: Dashboard and Profile
- Epic: UI System and Layout
- Epic: Release Readiness

Each epic should be broken into stories such as schema setup, API endpoints, validation, UI screens, state wiring, and test coverage.

## Recommended Implementation Order
1. Define schema and permissions first so every feature has a stable data model.
2. Build authentication and workspace tenancy before project data, since all core resources depend on that boundary.
3. Implement projects and board structures before issue drag-and-drop, because tasks need a stable parent hierarchy.
4. Add issue CRUD, filtering, and comments before polish features.
5. Finish with dashboard summaries, profile work, and hardening.
6. Keep realtime and notifications out of the initial build, but reserve the architecture for them now.

## Decisions
- Multiple workspaces per user are in scope from day one.
- Board plus list/detail views are both in the MVP.
- Fine-grained RBAC should be planned into the schema even if only a subset is enforced initially.
- Realtime collaboration is not MVP, but the architecture should leave room for it.
- Workspace membership is the primary tenancy boundary.

## Verification Checklist
1. Confirm the MVP boundary with the selected decisions: multiple workspaces, board plus list/detail view, fine-grained roles, and future-ready realtime foundation.
2. Validate that each user story maps to at least one entity, API endpoint, and UI surface.
3. Review the dependency order so auth and tenancy are implemented before project and issue features.
4. After approval, convert the blueprint into implementation tickets and scaffold the repo.

## Next Step
Turn this plan into a concrete Jira-style epic/story backlog with acceptance criteria and dependencies.
