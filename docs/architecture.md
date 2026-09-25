# Architecture

## Current state

The repository is a BHVR Bun workspace with a Vite/React client, a Hono server, and a shared TypeScript package. TanStack Router and TanStack Query are already in the client. `server/src/index.ts` exposes the starter Hono routes. `server/src/client.ts` exports a typed Hono RPC helper that the client imports. `shared/src` exports the starter response type.

The root lists `client`, `server`, and `shared` as workspaces and uses the root `bun.lock`. The root `type-check` and `test` commands have no matching package scripts today. Spotify integration is part of the product direction but is not implemented. PostgreSQL, Drizzle, Three.js, and React Three Fiber are preparation-brief choices, not implemented capabilities.

## Ownership boundaries

```text
client/src/routes                 URL entry points
client/src/features               feature-specific React code
client/src/components/ui          shared UI primitives
client/src/three                  reusable 3D infrastructure
server/src/routes                 HTTP route registration
server/src/handlers               request and response handling
server/src/services               business rules
server/src/repositories           application database queries
server/src/integrations           external provider calls
shared/src                        cross-runtime contracts
packages/db                       future database infrastructure
packages/spotify                  future Spotify provider integration
tests/e2e                         future end-to-end tests
```

The server and shared packages keep their existing `src/` directories. Paths without code are ownership rules, not implemented layers; create them when needed. `packages/db` and `packages/spotify` are reserved directories, not Bun workspaces or working integrations yet.

## Dependency direction

Client and server may use `shared`. Server repositories may use `packages/db`, and server integrations may use `packages/spotify`, once those packages are implemented. Reusable packages must not import client or server code. `shared` must not import application code or provider integrations.

The current client imports a browser-safe runtime helper from `server/client` for Hono RPC. This starter boundary is preserved to keep the demo working. Revisit it only with a coordinated change to the client and server; do not silently replace Hono RPC with an unrelated API style.

## Tradeoffs

| Choice | Benefit | Cost and control |
| --- | --- | --- |
| Bun monorepo | One lockfile and explicit workspace dependencies | Package configuration adds work; create only packages with an agreed owner. |
| Layered server folders | Predictable route, handler, service, and repository placement | One feature can touch several folders; add domain subfolders only when a domain has code. |
| Shared contracts | One definition for data both runtimes use | `shared` can become a dumping ground; keep implementation and secrets out. |
| Separate provider packages | Isolates external API and database details | Empty wrappers add maintenance; defer provider code until behavior is specified. |

The expected request path is route, handler, service, repository, database. Use only the layers a concrete feature needs. A simple starter route can remain simple.
