# Architecture and operations

**Audience:** Backend engineers shipping a NestJS API with PostgreSQL.

## Overview

This codebase follows **modular clean architecture**: HTTP adapters (controllers) stay thin, **services** own orchestration and business rules, **repositories** wrap persistence, **DTOs** validate input, and **serializers** shape outward-facing JSON. Cross-cutting concerns live under `src/common/`.

## macOS and Windows (cloning and daily dev)

The repo is set up so the **same commands** work after `git clone` on macOS and Windows:

| Concern               | What we did                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Line endings**      | [`.gitattributes`](.gitattributes) uses `text=auto` / LF for source so checks and diffs match across machines. [`.editorconfig`](.editorconfig) keeps editors aligned.                                                                                         |
| **`npm` scripts**     | `lint` avoids Unix-only brace expansion (`{src,test}/**` breaks on **cmd.exe**); `test:debug` invokes `jest` via `node .../jest/bin/jest.js` so it is not tied to `.bin/jest` shims.                                                                           |
| **Paths**             | App code uses `path.join` / `resolve` where paths are built (e.g. ORM, seeders).                                                                                                                                                                               |
| **Docker**            | From project root, use **Docker Desktop**: `docker compose up -d` (same `docker-compose.yml` on both OSes).                                                                                                                                                    |
| **`bcrypt` (native)** | First `npm install` on Windows may require [build tools](https://github.com/nodejs/node-gyp#on-windows) (Visual Studio “Desktop development with C++” or `windows-build-tools`). If that is a problem, consider switching to `bcryptjs` in a follow-up change. |

Use **Node.js LTS** and a normal shell (**PowerShell**, **cmd**, or **Git Bash**). Run `npm install`; settings come from **[YAML (`config/default.yml`)](#yaml-configuration-ttc-style)** (and optional `.env` overrides), then run migrations and `npm run start:dev` as documented below.

## YAML configuration (TTC style)

Aligned with the **TTC employee panel** stack (`node-config` + `config/*.yml`): the repo root **`config/`** folder holds **`default.yml`** (safe dev defaults, committed) and **`default.sample.yml`** (template copy). Optional **`config/local.yml`** is gitignored for machine-specific overrides (the [`config`](https://github.com/node-config/node-config) package picks it up automatically when present).

| File                                                                                   | Role                                                                                                      |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`config/default.yml`](config/default.yml)                                             | Primary defaults: `server`, `db`, `jwt`, `app` (same shape as TTC’s `config/default.sample.yml`).         |
| [`config/default.sample.yml`](config/default.sample.yml)                               | Reference / reset template.                                                                               |
| [`config/custom-environment-variables.json`](config/custom-environment-variables.json) | Maps `process.env` → nested keys (so Docker/CI can set `DB_HOST`, `JWT_SECRET`, etc.).                    |
| [`src/config/load-env-first.ts`](src/config/load-env-first.ts)                         | Loads `.env` (optional), then `node-config`, then copies merged values onto `process.env` for Joi + Nest. |

Execution order: **dotenv → YAML merge (including env overrides) → `process.env` sync**. You can delete `.env` entirely if `config/default.yml` is sufficient for local work.

This repo keeps the **same section style** as TTC (`server` → `db` → `jwt` → `app`) but **only one HTTP server**: `server.port`, `server.origin` (maps to `CORS_ORIGIN`), and `server.apiPrefix` for the Nest global prefix. There are no `frontend-server`, `supplier-server`, or extra `*-app` blocks.

## Folder conventions

| Area                   | Responsibility                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `common/`              | Shared decorators, filters, interceptors, base entity, pagination helpers                                          |
| Root `config/*.yml`    | **Runtime** settings loaded by `node-config` (TTC-style); see [YAML configuration](#yaml-configuration-ttc-style). |
| `src/config/`          | TypeScript: env sync bootstrap, Joi schema, `registerAs` database factory for Nest                                 |
| `modules/*/`           | Vertical slices (users, auth) with internal layers                                                                 |
| `database/migrations/` | Forward/backward TypeORM migrations                                                                                |
| `database/seeders/`    | Optional bootstrap data                                                                                            |

## API response envelope

Success (single resource):

```json
{
  "success": true,
  "data": { "id": "…", "email": "user@example.com" }
}
```

Success (paginated list — `items` flattened to `data`, meta at top level):

```json
{
  "success": true,
  "data": [{ "id": "…" }],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 42,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Error (validation / HTTP / unknown):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": { "_global": ["email must be an email"] },
  "path": "/api/auth/login",
  "timestamp": "2026-05-07T00:00:00.000Z"
}
```

Implemented by `TransformResponseInterceptor` and `AllExceptionsFilter`.

## Naming conventions

- **Files:** `kebab-case.ts` for general files; Nest idioms allow `*.module.ts`, `*.controller.ts`, `*.service.ts`.
- **Classes:** `PascalCase` (`UsersService`, `UserRepository`).
- **Methods:** `camelCase` verbs (`findAllPaginated`, `softDelete`).
- **DTOs:** suffix `Dto` (`CreateUserDto`); **request** vs **response** folders clarify intent.
- **Database:** `snake_case` column names in migrations; property `camelCase` on entities with explicit `name:` mapping.
- **Interfaces:** `I` prefix optional; repository contracts may use `IUserRepository` for test doubles.

## Repository pattern

- `IUserRepository` describes persistence capabilities.
- `UserRepository` is `@Injectable`, uses `@InjectRepository(User)`, and is the only layer that should use the TypeORM `Repository` API for users.
- Services inject the concrete repository (or an interface token if you introduce `@Inject('USER_REPOSITORY')` for stricter ports/adapters).

## Security practices

- **JWT:** Short-lived access tokens in production; consider refresh tokens and rotation for full SaaS posture.
- **Secrets:** Never commit `.env`; use strong `JWT_SECRET` (≥16 chars in schema); rotate on breach.
- **Passwords:** Bcrypt with cost factor appropriate to hardware (10 here as a baseline).
- **Validation:** Global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` strips unknown fields.
- **Guards:** `JwtAuthGuard` is registered globally; mark public routes with `@Public()`.
- **CORS:** Tighten `CORS_ORIGIN` in production to known front-end origins.
- **SQL:** Prefer repositories/query builders over string_concat SQL.
- **Rate limiting / helmet:** Add `@nestjs/throttler` and `helmet` at the edge for production ingress.

## Production practices

- **Turn off** `DB_SYNCHRONIZE`; rely on **migrations**.
- Run `migration:run` in CI/CD before `start:prod`.
- Use structured logging (e.g. Pino) and correlation IDs.
- Health checks and readiness probes hitting a **database-aware** health indicator.
- Metrics (OpenTelemetry / Prometheus) on HTTP, DB pool, and business events.

## Scalable SaaS recommendations

- Split **read models** or introduce caching for hot lists when pagination grows.
- Publish **domain events** (Nest EventEmitter or a broker) instead of chaining module imports.
- Introduce **multi-tenancy** (`tenantId` on `BaseEntity`, scoped repositories) early if required.
- Keep modules **boundary-first**: new bounded contexts get `modules/<context>/` with the same inner structure.

## Migrations and seeding

1. `docker compose up -d` (or your managed Postgres).
2. Edit [`config/default.yml`](config/default.yml) (or add gitignored `config/local.yml`), optionally copy [`.env.example`](.env.example) → `.env` for extra overrides, then adjust secrets locally.
3. `npm run migration:run`
4. Optional: `npm run seed` (creates `admin@example.com` / `ChangeMe123!` if missing).

**If Postgres says `role "…" does not exist`:** The committed [`config/default.yml`](config/default.yml) uses username `postgres` (common local superuser). Override `db.username`, `db.password`, and `db.database` in **`config/local.yml`** to match your install (e.g. MAMP sometimes uses your macOS login as the DB role). Ensure the database exists (`createdb genius_dress_hire` or your chosen name).

**Docker:** If you used an older `docker-compose.yml` with user `app` and hit auth errors after this change, run `docker compose down -v` once to recreate the volume (destroys container DB data), then `docker compose up -d` again.

Generate a new migration after entity changes:

```bash
npm run migration:generate -- src/database/migrations/DescribeChange
```

## Example `package.json` scripts (already wired)

| Script                 | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `start:dev`            | Watch mode                                                                 |
| `build` / `start:prod` | Compile and run `dist/main`                                                |
| `lint` / `format`      | ESLint + Prettier                                                          |
| `test`                 | Unit tests                                                                 |
| `test:e2e`             | Runs E2E file (suite is skipped unless `RUN_E2E=true`; see `test:e2e:run`) |
| `test:e2e:run`         | **`RUN_E2E=true`** via `cross-env` (macOS + Windows) when Postgres is up   |
| `migration:*`          | TypeORM CLI via `typeorm-ts-node-commonjs`                                 |
| `seed`                 | Dev admin user                                                             |

## Suggested commit structure (Conventional Commits)

- `feat(users): add paginated list with search`
- `fix(auth): normalize email before lookup`
- `chore(db): add users migration`
- `docs: describe API envelope in ARCHITECTURE.md`

Scope = module or concern; imperative subject; body explains trade-offs and rollout.

## Quick reference: how to add a new module

1. `nest g module modules/orders` (or copy `users` layout).
2. Entity extends `BaseEntity` for UUID + soft delete + timestamps.
3. DTOs in `dto/request` + `dto/response`; Serializer maps entity → response DTO.
4. Repository encapsulates TypeORM; service owns rules; controller returns service results only.
5. Register `TypeOrmModule.forFeature([Entity])`; export services other modules need.
6. Add migration; never rely on `synchronize` in production.
