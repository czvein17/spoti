# Architecture

## Current state

The repository is a BHVR Bun workspace with a Vite/React client, a Hono server, and a shared TypeScript package. TanStack Router and TanStack Query are already in the client. `server/src/index.ts` exposes the starter Hono routes. `server/src/client.ts` exports a typed Hono RPC helper that the client imports. `shared/src` exports the starter response type.

The root lists `client`, `server`, and `shared` as workspaces and uses the root `bun.lock`. The client is initialized with shadcn/ui's Radix-based preset and has a generic Button primitive. The root `type-check` and `test` commands have no matching package scripts today. Spotify integration is part of the product direction but is not implemented. PostgreSQL, Drizzle, Zustand, Three.js, and React Three Fiber are preparation-brief choices, not implemented capabilities.

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

### Frontend responsibilities

The frontend has two UI layers: generic shadcn/ui primitives in `client/src/components/ui/`, and product components inside their owning `client/src/features/<domain>/` feature. Product components compose foundation primitives; they do not belong in the shared primitive directory.

Within a feature, use `components/` for presentation, `hooks/` for React coordination, `api/` for backend communication, `queries/` for TanStack Query configuration, `services/` for framework-independent client logic, `utils/` for small explicit helpers, and `three/` for React Three Fiber / Three.js internals. These are ownership rules, not a requirement to create every folder. The current feature directories are empty; add files and folders when real behavior needs them.

The usual remote-data path is route/page → feature controller hook → query or mutation hook → query definition → API function → backend. Services support client-side calculations and transformations where needed; they are not a mandatory step in every request. Presentation composition runs route/page → product component → foundation UI. 3D implementation stays behind feature 3D components, which expose higher-level components to ordinary product UI.

Keep React presentation components focused on rendering and small UI state. Hooks coordinate React behavior without becoming catch-all logic modules. TanStack Query owns remote state; if Zustand is introduced, use it for genuine client-owned state rather than mirroring remote data. The backend remains authoritative for business and authorization rules even when the UI renders from server-provided permissions.

The existing BHVR starter route demonstrates typed Hono RPC and TanStack Query in one small example. Preserve it as a demo; new feature code should put backend calls behind feature API functions and should not copy the demo's inline arrangement as a requirement.

The shadcn/ui foundation is configured in the client; only the generated Button primitive is present. Zustand, Three.js, React Three Fiber, and domain features remain unimplemented; keep current capabilities distinct from planned ones.

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
