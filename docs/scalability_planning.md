# TaskFlow Scalability & System Design Plan

> Planning document only. This roadmap is based on the current repository and does not require an immediate application rewrite. Application changes should be implemented in small, measurable phases.

## Scope and Scale Stages

TaskFlow is a Jira/Asana-style project-management application. The current direction should remain a production-style modular monolith using free/open-source tools and free tiers where practical.

These are planning scenarios, not capacity guarantees:

- **Stage 1:** hundreds of users and thousands of issues.
- **Stage 2:** thousands of users and hundreds of thousands of issues.
- **Stage 3:** large-scale testing, higher concurrency, and significantly larger datasets.

Capacity must be established with repeatable benchmarks in the target deployment environment.

## 1. Current Architecture

### Repository findings

- Backend: Bun, Express, TypeScript, Prisma 7, PostgreSQL, Zod, JWT, bcrypt, Google OAuth, Multer, Cloudinary, and Pino.
- Frontend: React 19, TypeScript, React Router, Zustand, Axios, React Hook Form, Tailwind CSS, and Bun.
- Backend layering is `Route -> Controller -> Service -> Repository -> Prisma/PostgreSQL`.
- Modules exist for authentication, organizations, workspaces, projects, boards, issues, sprints, comments, attachments, notifications, reports, and related membership flows.
- Tenancy is organization -> workspace -> project, with membership tables at each level.
- Project creation creates a board and default columns. Issues belong to projects and columns, with optional sprint and assignee relationships.
- Controllers use a shared `success/message/data` response envelope.
- Prisma migrations are present, including the `Project.issueCounter` migration.
- The frontend stores server data and mutation state in Zustand stores. It does not currently use a dedicated server-state cache such as TanStack Query.

### Keep as-is

- Keep the modular monolith and module ownership boundaries.
- Keep the Route -> Controller -> Service -> Repository structure. It provides useful separation without microservice complexity.
- Keep PostgreSQL as the source of truth.
- Keep Prisma for ordinary CRUD and transactions. Use reviewed SQL only for measured hot paths.
- Keep HTTP-only cookies for browser authentication, with deliberate production CORS and cookie settings.
- Keep Cloudinary for the current student/portfolio stage unless quota, portability, or storage requirements change.

### Current architectural risks

- Validation previously parsed transformed values but discarded them. Pagination now has an explicit controller conversion, but transformation behavior needs tests.
- Protected requests perform a database user lookup in authentication middleware. This is acceptable at Stage 1 but should be measured.
- Services repeat organization, workspace, project, and membership lookups. This is clear but may create excess round trips.
- Authorization should be tested endpoint-by-endpoint rather than inferred from route placement.
- No repository-wide automated tests, CI workflow, health endpoints, graceful shutdown, rate limiting, request IDs, deployment manifests, or documented backup procedure were found.
- Backend and frontend contain development `console.log`/`console.error` calls in addition to partial Pino usage.

## 2. Current Scalability Assessment

### Stage 1

The current architecture is suitable for learning, portfolio deployment, hundreds of users, and thousands of issues after correctness, bounded reads, security hardening, tests, and basic observability are added. One backend process, free-tier PostgreSQL, and Cloudinary are sufficient planning assumptions. Do not add Redis, Kafka, OpenSearch, Kubernetes, or microservices merely for appearance.

### Stage 2

The modular monolith can remain viable with composite indexes, cursor pagination for large feeds, query-specific projections, connection-pool tuning, grouped reports, selective caching, asynchronous notifications, and load testing. A separate worker process is a more likely next step than service extraction.

### Stage 3

Use measurements to decide whether Redis-compatible caching, durable queues, read replicas, archival/partitioning, OpenTelemetry, or a dedicated search engine is warranted. These are conditional options, not baseline requirements.

## 3. Design Goals and Principles

1. Preserve the modular monolith while removing correctness and concurrency risks.
2. Make every large read bounded, observable, and explainable with query plans.
3. Enforce organization/workspace/project authorization consistently.
4. Make issue creation, numbering, board movement, and sprint transitions transactionally safe.
5. Separate API DTOs from Prisma models and standardize response/error contracts.
6. Use PostgreSQL capabilities before adding infrastructure.
7. Measure latency, errors, query duration, pool wait, response size, cache hit rate, queue lag, and frontend render/request performance before optimizing.
8. Add infrastructure only when there is a concrete problem, an owner, a failure plan, and a verification metric.

## 4. Database Scalability

### Existing strengths

The schema has foreign keys, cascading behavior, and useful uniqueness constraints for email, provider identity, membership pairs, project slug/key, board-per-project, column position, workspace labels, and project-scoped issue keys. Existing indexes cover many foreign keys and filters, including project, column, sprint, assignee, reporter, status, priority, notifications `(userId, isRead)`, comments, attachments, and activities.

### Current risks

- Issue listing filters by `projectId` and `isArchived`, sorts by `createdAt DESC`, and paginates. Separate single-column indexes may not support the whole access pattern.
- Board queries need project/column/archive/order support.
- Sprint issue queries use project/sprint/archive and position ordering.
- Notifications filter by user/read state and sort by creation time, but the current index omits ordering.
- Comments, activities, notifications, and attachments are not consistently bounded/paginated.
- Reports currently load project issues into Node and sprint progress performs one issue query per sprint.
- Exact `COUNT(*)` on every issue page may become expensive for large projects.
- Column position is calculated with a count and can race under concurrent issue creation.
- `Activity` is an issue activity stream, not a complete compliance audit-log system.
- Migration history includes old schema structures and must be tested from an empty database.

### Index policy

Do not add indexes blindly. For each candidate, capture the generated SQL, run `EXPLAIN (ANALYZE, BUFFERS)` against representative data, and record read latency, rows scanned, storage, and write cost.

| Query | Candidate index | Why current indexes may be insufficient | Priority and cost |
|---|---|---|---|
| Active project issues ordered by newest | `(projectId, isArchived, createdAt DESC, id DESC)` | Combines tenant filter, archive filter, and stable order | Stage 1 after measurement; adds write/storage cost |
| Board issues ordered within columns | `(projectId, columnId, isArchived, position, id)` | Existing indexes are separate and may still require filtering/sorting | Stage 1/2 if plans justify it |
| Sprint issues ordered by position | `(projectId, sprintId, isArchived, position, id)` | Current sprint index lacks full filter/order coverage | Stage 1 if sprint traffic warrants it |
| Notifications newest by user/read state | `(userId, isRead, createdAt DESC, id DESC)` | Existing index omits ordering | Stage 1 if notification volume grows |
| Comments by issue and time | `(issueId, createdAt ASC, id)` | Existing issue index lacks deterministic ordering | Add with comment pagination |
| Activities by issue and time | `(issueId, createdAt DESC, id)` | Existing issue index lacks ordering | Later with activity retention policy |

### Connection management

`pg.Pool` currently uses only the connection string. Add environment-controlled pool size, connection timeout, idle timeout, and statement/query timeout after checking provider limits. Keep one Prisma client per process and close Prisma/pool during shutdown. For multi-instance or serverless deployment, use a provider-supported pooled endpoint or PgBouncer where necessary; do not assume a large pool improves performance.

## 5. Issue Key Generation

### Current implementation

Issue creation increments `Project.issueCounter`, builds keys such as `TEST-1`, counts active issues for a column position, and inserts the issue. The counter update and issue insert are currently separate operations. A failed insert can consume a number, and the position count can race. The `(projectId, issueKey)` unique constraint is an important final safeguard.

This is already better than scanning every project issue for every key, but it needs transactional protection and migration verification.

### Recommended strategy

1. Backfill each counter to the maximum valid numeric suffix in existing issue keys.
2. Identify malformed or duplicate legacy keys before enabling the new path.
3. Allocate the counter and insert the issue in one Prisma interactive transaction.
4. Keep the unique `(projectId, issueKey)` constraint.
5. Add safe retry behavior only after issue creation has an idempotency strategy.
6. Accept gaps. Display numbers are not accounting numbers and should not be required to be gap-free.

At Stage 2, consider a dedicated project counter row or project-scoped PostgreSQL sequence only if contention is measured. A counter row is easier to understand; sequences are fast but harder to manage dynamically and also permit gaps.

Verification: concurrent issue creation, failed insert rollback, counter backfill comparison, malformed-key report, and duplicate-key checks.

## 6. API Scalability

Keep routes responsible for middleware/endpoint registration, controllers thin, services responsible for business rules, repositories responsible for persistence, and validators separate.

Improve the shared contract by:

- Defining shared response and error DTOs for backend and frontend.
- Standardizing validation, authorization, pagination, and correlation-ID responses.
- Returning only required fields through explicit Prisma `select` projections.
- Adding bounded defaults and maximums to every collection endpoint.
- Adding deterministic ordering using a primary sort plus `id` tie-breaker.
- Allowlisting sort fields and directions.
- Introducing `/api/v1` only before a public breaking contract is released.
- Adding bulk operations only when user workflows justify them, with batch limits, authorization, transaction semantics, and partial-failure rules.

### Rate limiting and idempotency

Add route-sensitive rate limits for login, refresh, registration, invitations, password changes, OAuth, and uploads. A process-local limiter is enough for one instance; a shared store becomes necessary only with multiple instances.

Use idempotency keys first for issue creation, invitations, and attachment registration, not for every PATCH. Store keys scoped to user/operation with a unique constraint and expiry policy.

## 7. Pagination Strategy

### Offset pagination

Keep offset pagination for small project lists and administrative views. It matches the current issue UI and is simple. It becomes slower at deep pages and can shift under concurrent inserts.

### Cursor pagination

Add cursor pagination for comments, activities, notifications, search, and large issue feeds when benchmarks show deep-offset or mutation problems. Use stable `(createdAt, id)` cursors and return `nextCursor`/`hasMore`.

- Stage 1: offset plus maximum page size and stable ordering.
- Stage 2: cursor mode for large/high-write collections.
- Stage 3: cursor-first operational feeds.

Make exact totals optional where possible. Board screens may need `hasMore` and per-column counts more than an exact project-wide count.

## 8. Query Optimization and N+1 Prevention

- Replace broad `include` calls with explicit screen-specific selects.
- Do not load descriptions or relation trees for board cards unless required.
- Instrument query count and duration before optimizing.
- Replace report full scans with grouped PostgreSQL aggregates.
- Replace sprint-progress one-query-per-sprint behavior with one grouped query.
- Consider one authorization-context query for repeated organization/workspace/project/member lookups after correctness tests exist.
- Keep notification fan-out synchronous at Stage 1; use a worker when team size or latency makes it necessary.
- Do not add a generic DataLoader abstraction without a measured request-level N+1 problem.

## 9. Transactions and Concurrency

Use transactions for user/account creation, organization/workspace/project bootstrap, atomic issue counters, sprint completion, membership invariants, and idempotency record plus mutation result.

Specific risks to test:

- Issue counter allocation plus insert must be atomic.
- Column position based on `count` can collide under concurrent creates.
- Issue moves update column/status but do not clearly update position; define the invariant.
- Refresh-token rotation can race when two refresh requests run concurrently.
- Sprint completion and `NEXT_SPRINT` reassignment must be validated atomically.
- Cloudinary cannot participate in a database transaction. Use staged attachment state or compensating cleanup when provider and database operations disagree.

## 10. Caching

### Recommendation now: no distributed cache

Project metadata, board columns, and membership reads should first be improved with projections, indexes, and request deduplication. Caching mutable issue lists without invalidation would create stale-state bugs.

| Option | Recommendation | Pros | Cons | Reconsider when |
|---|---|---|---|---|
| No cache | Default Stage 1 | Lowest complexity | Repeated reads remain database reads | A measured hot query exists |
| Process-local TTL cache | Small stable metadata only | Free and simple | Lost on restart; inconsistent across instances | One-instance metadata is demonstrably hot |
| Redis-compatible cache | Stage 2 conditional | Shared cache, rate limits, locks, queues | New network failure and invalidation complexity | Multiple instances or measured cache need |
| PostgreSQL summaries/materialized views | Reports later | Keeps data in Postgres | Refresh design required | Analytics queries dominate workload |

## 11. Background Jobs

Keep issue CRUD, board movement, authorization, and small notification writes synchronous initially.

Possible future jobs: email delivery, notification fan-out, report materialization, Cloudinary cleanup/reconciliation, activity processing, and expired invite/token cleanup.

Use a database-backed worker first if a real asynchronous need appears. At Stage 2, compare `pg-boss` for PostgreSQL-first simplicity with BullMQ plus Redis for richer queue features. Jobs require idempotency, retries, exponential backoff, maximum attempts, dead-letter visibility, and queue-lag metrics. Do not use Kafka for this project stage.

## 12. Search

Repository evidence shows no complete backend search system; some frontend search/filter behavior operates on already-loaded client data. This is acceptable only for small datasets.

1. Stage 1: bounded, parameterized PostgreSQL `ILIKE` with tenant filters.
2. Stage 1/2: PostgreSQL full-text search for title/description.
3. Stage 2: `pg_trgm` plus GIN/GiST indexes for substring/fuzzy issue-key/title search.
4. Stage 3: OpenSearch only if ranking, facets, fuzzy search, or cross-resource indexing outgrows PostgreSQL.

OpenSearch/Elasticsearch should not be introduced now because it duplicates data and requires indexing pipelines and additional operations.

## 13. Logging and Observability

### Current state

Pino supports pretty development output and JSON production output. Some issue/report/error paths use structured fields, but many console calls remain. Request IDs, request timing, metrics, tracing, health endpoints, and retention policies are not yet present.

### Pino strategy

- Generate or validate a request ID and attach it to the response and a child logger.
- Log method, route template, status, duration, request ID, user ID where appropriate, and normalized error code.
- Use `fatal` for process-ending failures, `error` for dependency/request failures, `warn` for denials/rate limits/security events, `info` for business lifecycle events, and `debug` for local diagnosis.
- Log authentication outcomes, refresh rotation, authorization denials, issue creation/movement, membership changes, uploads, reports, migrations/startup, and shutdown.
- Redact passwords, JWTs, refresh tokens, OAuth credentials, Cloudinary secrets, cookies, authorization headers, uploaded content, and unnecessary personal data.
- Replace backend operational console calls with Pino; gate frontend diagnostics to development and never log credentials or full response payloads.

Metrics to establish: request count, error rate, p50/p95/p99 latency, database query duration/count, pool wait, transaction retries, auth failures, authorization denials, upload failures, report duration/rows scanned, frontend API latency, board render time, and large-list interaction latency.

Free options: platform stdout logs first; later OpenTelemetry with Grafana/Loki/Prometheus for self-hosting, or a verified free error-monitoring tier such as GlitchTip. Hosted limits must be checked before adoption.

## 14. Security

### Authentication and sessions

Keep short-lived access tokens and HTTP-only refresh cookies, but explicitly validate token expiration configuration. The current hashed refresh token in the account row effectively permits one active token per account/provider. This is acceptable for Stage 1 if documented; use a `sessions`/`refresh_tokens` table with token-family rotation, revocation, expiry, device metadata, and replay detection for multi-device sessions.

Do not return tokens in JSON when cookies are the browser transport. Add rate limiting and event logging for login, registration, refresh, password changes, and OAuth.

### Authorization

Test every endpoint with wrong organization, wrong workspace, wrong project, non-member, removed member, viewer, member, admin, and owner identities. Apply the same tenant boundary to reports, attachments, comments, sprints, board columns, notifications, and activities.

### Input, output, and infrastructure security

- Zod must validate body, params, and query, including bounds and transformed values.
- Prisma parameterization protects ordinary SQL operations; raw SQL must remain parameterized.
- Use explicit response DTOs to avoid data leakage.
- React escaping provides baseline XSS protection; sanitize any future untrusted HTML.
- SameSite cookies help CSRF protection. If deployment becomes cross-site, add origin checks or CSRF tokens.
- Restrict credentialed CORS to configured origins and add Helmet/security headers with a CSP compatible with Cloudinary.
- Multer currently uses memory storage with a 10 MB limit and no visible MIME/content allowlist. Add allowed MIME types, extension/content checks, image dimension limits, route-specific limits, and upload rate limits. Memory storage can increase RAM usage under concurrent uploads.
- Keep Cloudinary credentials server-side, store public IDs explicitly where possible, and make provider/database reconciliation retryable.
- Production errors must not expose Prisma details or stack traces; return safe messages and a correlation ID.

## 15. Frontend Performance

### Current state

Zustand holds server data and mutation state. Axios has a refresh interceptor and stale commented code. Board loading uses separate board, column, and issue requests. Reports use four parallel requests. There is no visible TanStack Query cache, virtualization, route lazy loading, Suspense boundary, or request deduplication layer. Client-side filtering is used for some lists.

### Recommendations

Stage 1:

- Standardize API response types and Axios error normalization.
- Prevent duplicate in-flight layout/route requests.
- Scope or clear Zustand data by organization/workspace/project.
- Add optimistic board movement only with rollback and refetch.
- Keep lists paginated and avoid loading all members/issues for filtering.
- Add route-level code splitting after bundle measurement.
- Use image dimensions, lazy loading, and Cloudinary transformations.

Stage 2:

- Evaluate TanStack Query for server-state caching, invalidation, retries, and deduplication while retaining Zustand for UI state.
- Virtualize issue lists only when profiling shows DOM rendering is a bottleneck.
- Add a board-specific projection endpoint if board payloads or request count become expensive.

Do not add blanket `useMemo`, `useCallback`, or memoization without profiler evidence.

## 16. Testing and Load Testing

No automated tests were found. Testing is the highest-leverage scalability improvement before infrastructure.

### Required test layers

1. Unit: validators, pagination parsing, issue-key parsing, authorization policies, response mapping, retry and idempotency decisions.
2. Repository/integration: PostgreSQL constraints, transactions, membership boundaries, soft archive, migrations, and query behavior.
3. API: authentication, refresh, authorization matrix, issue CRUD/move, sprint completion, reports, attachments, and validation.
4. Concurrency: issue creation, refresh rotation, board position, invitations, and sprint completion.
5. Frontend: API envelopes, store transitions, pagination, optimistic rollback, and auth bootstrap.
6. Browser: login -> workspace -> project -> board critical path.
7. Contract: backend response shapes versus frontend API types.

Free tools: Bun test or Vitest, Supertest/direct HTTP tests, Testcontainers when Docker is available, Playwright, and disposable PostgreSQL.

### Load testing

Use **k6** first because it is open source, scriptable, REST-friendly, and supports thresholds. Artillery is a good alternative for YAML-oriented scenarios and future WebSocket testing.

Seed Stage 1 and Stage 2 datasets. Test login/refresh, board load, issue list, create, move, reports, notifications, and uploads separately. Record p50/p95/p99, errors, database time, pool behavior, memory, CPU, and response sizes. Never load-test shared production data destructively.

## 17. Deployment Architecture

A realistic free-tier candidate is:

```text
React frontend -> Cloudflare Pages or another free static host
Express/Bun backend -> verified free-tier Bun-compatible host
PostgreSQL -> Neon, Supabase, or another verified free PostgreSQL provider
Images -> Cloudinary free tier
HTTPS/DNS -> provider-managed HTTPS
```

Provider terms and free limits must be rechecked when implementation starts. Free tiers may sleep, have quotas, ephemeral files, or change.

### Production checklist

- Separate development, test, and production environment variables.
- Validate required secrets without printing values.
- Configure exact credentialed CORS origins.
- Build the frontend with the production API URL.
- Generate Prisma client and run `prisma migrate deploy` in a controlled release step.
- Use pooled runtime database URLs and a direct migration URL only when required.
- Add `/health/live` and `/health/ready`; readiness should check PostgreSQL with a bounded timeout.
- Gracefully close HTTP server, Prisma, and the pool.
- Treat backend filesystem storage as ephemeral.
- Include release/version metadata in logs.

## 18. CI/CD

Use GitHub Actions. For pull requests:

- Install using the repository's Bun lockfile strategy.
- Type-check backend and frontend.
- Run formatting/lint checks after they are standardized.
- Run Prisma format/validate/generate checks.
- Run unit/API/integration tests.
- Build frontend and backend.

On merge to `main`:

- Repeat required checks.
- Build from the commit SHA.
- Apply `prisma migrate deploy` in the deployment environment.
- Run health, authentication, and protected-read smoke tests.
- Retain migration and release logs.

Use expand -> migrate data -> switch reads/writes -> contract cleanup for breaking schema changes. Never use destructive reset commands in deployment.

## 19. Reliability and Failure Handling

- Database failures: bounded timeouts, safe 503 responses, readiness failure, and retries only for known transient operations.
- Cloudinary failures: do not report success before upload success; reconcile provider-success/database-failure with cleanup or retry.
- OAuth failures: bounded timeout, safe user message, categorized logs, no credential logging.
- Duplicate requests: database constraints plus idempotency for create/invite/upload registration paths.
- Retries: exponential backoff and jitter only for safe/transient operations.
- Shutdown: stop accepting traffic, drain with a deadline, close Prisma/pool, exit.
- Liveness should not require the database; readiness should check dependencies.
- A notification failure should not roll back a successful primary issue mutation unless atomic delivery is an explicit product requirement.
- Add timeouts to Cloudinary and external OAuth calls.

## 20. Backup and Recovery

Verify the chosen PostgreSQL provider's free-tier backup policy. Initially, schedule logical `pg_dump` backups to private encrypted storage where permitted and test restoring into a disposable database.

Keep migrations in version control. Document restore order: database backup, migrations, Cloudinary asset considerations, environment restoration, and smoke checks. Store Cloudinary public IDs to support reconciliation. Start with an appropriate portfolio-project RPO/RTO such as daily backup and manual restore, then improve based on data importance.

## 21. Architecture Evolution

### Modular monolith: recommended now

It minimizes operations, keeps transactions simple, and fits the current project and likely ownership model.

### Modular monolith plus worker: likely next evolution

Add a separately run worker for emails, notifications, reports, cleanup, or media reconciliation while retaining one database and explicit module boundaries.

### Microservices: not recommended now

Split only when there is an independent scaling/deployment boundary, ownership boundary, technology-isolation need, or measured database contention that cannot be addressed in the monolith. Microservices introduce network retries, distributed tracing, cross-service authorization, data ownership, deployment complexity, and eventual consistency.

## 22. Free/Open-Source Decision Table

| Problem | Recommended approach | Alternative | Why recommended | Pros | Cons | Reconsider when |
|---|---|---|---|---|---|---|
| Server state | Keep Zustand now; evaluate TanStack Query later | Custom store improvements | Avoids a risky rewrite before measurement | Small immediate change | Migration cost later | Duplicate requests/stale state recur |
| Large collections | Offset initially; cursor for deep/high-write feeds | Cursor everywhere | Matches current UI and Stage 1 | Simple gradual migration | Deep offsets degrade | Stage 2 benchmarks show need |
| Search | PostgreSQL ILIKE/full text/trigram | OpenSearch | Same DB, no indexing pipeline | Low operations cost | Less advanced ranking | Search exceeds PostgreSQL |
| Shared cache | No cache or process-local TTL | Redis-compatible service | No invalidation/network cost now | Simple | Not shared across replicas | Multiple instances/hot reads |
| Jobs | Synchronous; DB-backed worker when needed | BullMQ + Redis | Avoids premature infrastructure | Easy to reason about | Worker cleanup/claim logic | Latency/volume requires async |
| Logs | Pino JSON with request IDs | Grafana/Loki or hosted tracker | Already installed | Structured and portable | Host retention limits | Multi-instance retention needs |
| Files | Cloudinary | S3-compatible storage | Already integrated and CDN-capable | Low backend storage burden | Quota/vendor dependency | Portability or quota issue |
| Architecture | Modular monolith | Microservices | Fits scope and transactions | Low operational cost | One deployable unit | Independent scaling boundary |
| Load tests | k6 | Artillery | Scriptable REST thresholds | Free and CI-friendly | Requires realistic scenarios | WebSocket-heavy requirements |

## 23. Phased Roadmap

### Phase 0: Baseline and safety — Now

Dependencies: none.

- Establish test, formatting, and migration-validation commands.
- Add request IDs, request timing logs, safe error codes, and redaction.
- Add liveness/readiness endpoints and graceful shutdown.
- Standardize response/error DTOs and frontend Axios error handling.
- Gate/remove debug console logging.
- Create repeatable seed data and baseline measurements.

Verification: CI build/type-check, health smoke test, request-ID propagation, redaction test, and baseline latency/error/query metrics.

### Phase 1: Correctness and bounded reads — Now

Dependencies: Phase 0 response/error conventions.

- Make issue counter allocation and insert one transaction.
- Backfill and verify issue counters.
- Bound and paginate comments, activities, notifications, and attachments.
- Add stable order and allowlisted filtering/sorting.
- Replace report full scans and sprint N+1 queries with aggregates.
- Define board position semantics and test concurrent creates/moves.
- Complete authorization matrix testing.
- Add upload validation and external timeouts.

Verification: concurrency tests, rollback tests, report query-count tests, authorization tests, large-page rejection, and upload failure tests.

### Phase 2: Database/API performance — Later

Dependencies: Phase 1 metrics and representative data.

- Run query plans for board, issue, sprint, notification, comment, activity, and report queries.
- Add only justified composite indexes.
- Add cursor pagination for large feeds/search.
- Tune pool and statement timeouts.
- Add query duration instrumentation and k6 Stage 1/2 scenarios.

Verification: before/after p95 latency, rows scanned, sort cost, DB CPU, pool wait, write overhead, and response size.

### Phase 3: Async work and caching — Conditional later

- Add durable jobs for notifications/email/reports/cleanup only when justified.
- Compare pg-boss with BullMQ plus Redis.
- Add short-TTL stable-metadata/report caching with invalidation.
- Add retry, dead-letter, queue-lag, hit-rate, and stale-read metrics.

### Phase 4: Search and frontend scaling — Conditional later

- Add PostgreSQL full-text/trigram search and server-side filters.
- Evaluate TanStack Query for server state.
- Add route splitting, image transformations, and virtualization only after profiling.

### Phase 5: Large-scale testing — Future

- Run Stage 3 tests with realistic failures.
- Add OpenTelemetry and centralized retention if needed.
- Consider Redis, read replicas, archival/partitioning, or OpenSearch only from measured bottlenecks.
- Re-evaluate service boundaries only after worker/read/search evolution.

## 24. Decision Log

- Keep modular monolith: current modules share transactions and have low operational overhead.
- Keep PostgreSQL: relationships and authorization are relational.
- Do not add Redis now: no measured distributed-cache, queue, or multi-instance rate-limit requirement.
- Do not add Kafka, Kubernetes, or microservices now: complexity exceeds the current target.
- Use cursor pagination selectively.
- Improve Pino instead of replacing it.
- Keep Cloudinary with safer upload validation and reconciliation.
- Use PostgreSQL search before OpenSearch.
- Use k6 first for load testing.
- Treat Activity as issue activity, not a complete compliance audit log.
- Recheck provider free-tier terms when deployment implementation begins.

## 25. Things We Should Not Implement Yet

- Microservices, Kubernetes, Kafka, service mesh, or event sourcing.
- Redis solely because it is common in industry.
- OpenSearch/Elasticsearch before PostgreSQL search is measured and insufficient.
- Read replicas or sharding before query plans and load tests show a database bottleneck.
- Complex distributed locks for ordinary CRUD.
- Realtime collaboration before a concrete workflow requires it.
- Generic caching for mutable issue lists without invalidation.
- Full compliance-audit infrastructure when issue activity is sufficient.
- Broad memoization or virtualization without frontend profiling.
- Paid observability or deployment services as hard requirements.

## 26. Dependencies and Verification Matrix

| Improvement | Depends on | Verification metric |
|---|---|---|
| Request observability | None | Request-ID coverage, p95 latency, error correlation |
| Atomic issue keys | Counter backfill and transaction tests | No duplicate keys under concurrency |
| Composite indexes | Representative data and query plans | Rows scanned, sort cost, p95 query time, write cost |
| Cursor pagination | Stable ordering and API contract | Deep-page latency and duplicate/missing row rate |
| Report aggregation | Report contract tests | Query count, rows transferred, report latency |
| Rate limiting | Trusted IP/user identity policy | Abuse rejection, false positives, endpoint latency |
| Background jobs | Idempotent operations and failure taxonomy | Retry success, dead letters, queue lag |
| Cache | Invalidation rules and metrics | Hit rate, stale-read rate, latency improvement |
| Search | Tenant-safe query contract | Search latency, relevance, index size |
| Frontend query cache | Normalized API contracts | Request deduplication and stale-state defects |
| CI/CD | Reproducible builds and migrations | PR pass rate, deploy smoke success, restore drill |

## 27. Success Criteria

The roadmap is succeeding when TaskFlow has evidence rather than assumptions:

- Protected requests have correlation IDs and safe structured logs.
- CI can type-check, validate Prisma, run tests, build, and reject broken migrations.
- Issue keys remain unique under concurrent creation and preserve visible formats.
- Large reads are bounded and reports do not transfer unnecessary full datasets.
- Authorization tests cover tenant boundaries and roles.
- Indexes are justified by query plans and measured improvements.
- Load tests show known p50/p95/p99 behavior for Stage 1 and Stage 2 scenarios.
- Deployments have health checks, controlled migrations, graceful shutdown, and a tested restore procedure.
- New infrastructure is added only when a measured problem and clear rollback/ownership plan exist.
