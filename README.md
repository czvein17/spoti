# Afterhours

Afterhours is a small social listening lounge. A guest can enter with a display name, join a seeded room, see the DJ and other listeners in a fixed 3D scene, and react to the room. Phase 1 uses mock track metadata and does not stream audio.

## Phase 1 status

| Area | Current state |
| --- | --- |
| Client | Vite, React 19, TanStack Router, TanStack Query, and a custom dark lounge interface. |
| Room scene | React Three Fiber with procedural placeholder avatars and predetermined spots. |
| Server | Bun and Hono typed RPC routes, split into handlers, service rules, and repositories. |
| Database | PostgreSQL and Drizzle under `packages/db`, with migrations and a repeatable development seed. |
| Guest identity | Tab-scoped display name and anonymous session ID; memberships expire after 60 seconds without a heartbeat. |
| Spotify | Reserved for a later phase; no OAuth or playback integration. |

## Run locally

Use Bun from the repository root:

```sh
bun install
```

Start your PostgreSQL sandbox container using its configured sandbox workflow. Set `DATABASE_URL` in `.env` to the connection string supplied for that container. The current local environment connects through `localhost:1717` to the `lounge` database; keep the sandbox username and password in `.env` and do not commit them.

Apply the committed schema and seed the sample room:

```sh
bun run db:migrate
bun run db:seed
bun run dev
```

For setup details, schema changes, and sandbox connectivity, see [local development](docs/development.md). Use the root `bun.lock`; do not add another lockfile.

## Useful commands

- `bun run build` builds all workspaces.
- `bun run type-check` checks all workspaces.
- `bun run test` runs the server behavior tests.
- `bun run lint` runs Biome lint checks.
- `bun run db:migrate` applies pending migrations to the configured database.
- `bun run db:seed` inserts the repeatable sample room data.
- `bun run db:generate` creates a migration after a schema change.

## Repository map

| Path | Owner |
| --- | --- |
| `client/src/routes/` | URL entry points. |
| `client/src/features/rooms/` | Discovery, guest coordination, room presentation, and 3D scene. |
| `server/src/` | HTTP routes, handlers, room rules, and application repositories. |
| `shared/src/` | Cross-runtime room contracts and constants. |
| `packages/db/` | Drizzle schema, database client, migrations, and seed data. |
| `packages/spotify/` | Reserved provider boundary for a later phase. |
| `docs/` | Product decisions, architecture, development setup, and engineering rules. |

Start with [AGENTS.md](AGENTS.md). The [product brief](docs/product.md) records the Phase 1 audience, selected behavior, data ownership, failure cases, and acceptance criteria. See [architecture](docs/architecture.md), [conventions](docs/conventions.md), [engineering standards](docs/engineering-standards.md), and [development setup](docs/development.md) for implementation details.
