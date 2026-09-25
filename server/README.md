# Server

The server is a Hono application running with Bun. `src/index.ts` defines the current starter routes:

| Route | Current response |
| --- | --- |
| `GET /` | Plain-text greeting. |
| `GET /hello` | JSON response using the type exported by `shared`. |

`src/client.ts` exports the typed Hono RPC helper used by the client.

## Run

From the repository root:

```sh
bun install
bun run dev:server
```

Build this workspace with `bun run build:server`. The current demo server is available at `http://localhost:3000` using the starter configuration.

## Source ownership

The server keeps its working `src/` layout. `src/routes/`, `handlers/`, `services/`, `repositories/`, `schemas/`, `middleware/`, `integrations/`, `config/`, and `lib/` are ownership rules; create each directory when it has code. The starter routes stay in `src/index.ts` until a feature needs those layers. There is no database connection, Drizzle schema, Spotify provider code, or product business logic here.

See the root [README](../README.md), [architecture](../docs/architecture.md), and [file organization](../docs/file-organization.md) for the boundaries.
