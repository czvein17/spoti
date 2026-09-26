# Server

The server separates Hono app composition from Bun startup. `src/app.ts` configures middleware and mounts the routes; `src/server.ts` starts Bun and serves `app.fetch` on port `3000`. `src/index.ts` re-exports the app for package compatibility. The current routes are:

| Route | Current response |
| --- | --- |
| `GET /` | Built client application after `bun run build`. |
| `GET /hello` | JSON response using the type exported by `shared`. |
| `GET /api/v1/rooms` | JSON list of available rooms. |

`src/client.ts` exports the typed Hono RPC helper used by the client.

## Run

From the repository root:

```sh
bun install
bun run dev:server
```

Build this workspace with `bun run build:server`. The development server is available at `http://localhost:3000`.

For a production-style run, use `bun run build` followed by `bun run start` from the repository root. Hono returns the generated `client/dist` files, the client-side route fallback, and API routes from one origin. Leave `CORS_ORIGINS` unset for this setup. Define exact origins only when browsers call Hono directly from another origin.

## Source ownership

The server keeps its working `src/` layout. App-wide middleware and route composition belong in `src/app.ts`; the Bun runtime entrypoint belongs in `src/server.ts`. `src/routes/`, `handlers/`, `services/`, `repositories/`, `schemas/`, `middleware/`, `integrations/`, `config/`, and `lib/` are ownership rules; create each directory when it has code. Room request handling, business rules, and database queries live in their corresponding route, handler, service, repository, and database modules. Spotify provider code is not implemented.

See the root [README](../README.md), [architecture](../docs/architecture.md), and [file organization](../docs/file-organization.md) for the boundaries.
