# Architecture

## Current state

The repository is a Bun workspace with a Vite/React client, a Hono server, a shared TypeScript package, and the `@app/db` PostgreSQL infrastructure package. The client uses TanStack Router and TanStack Query. `server/src/app.ts` composes the Hono middleware and routes, while `server/src/server.ts` starts Bun and serves the app; `server/src/index.ts` re-exports the app for package compatibility. `server/src/client.ts` exports the typed Hono RPC helper used by the room feature. `shared/src` exports the room contracts and reaction/spot identifiers.

The root lists `client`, `server`, `shared`, and `packages/db` as workspaces and uses the root `bun.lock`. The database package uses Drizzle ORM with PostgreSQL. The client includes React Three Fiber and Three.js for the room scene. The client and server have package-level type-check tasks; the server has a Bun test task. Spotify integration, Zustand, and account authentication remain unimplemented.

The client sends API requests to `window.location.origin`. During development, Vite forwards `/api` and `/hello` to Hono at `http://localhost:3000` by default. `API_PROXY_TARGET` can override that address. After `bun run build`, Hono returns the files in `client/dist` alongside its API routes. Both modes keep browser traffic on one origin.

## Ownership boundaries

```text
client/src/routes                 URL entry points
client/src/features               feature-specific React code
client/src/components/ui          shared UI primitives
client/src/three                  reusable 3D infrastructure, when needed
server/src/routes                 HTTP route registration
server/src/handlers/<domain>      request and response handling
server/src/schemas                server-side request validation
server/src/middleware             shared request and error handling
server/src/errors                 typed application errors and database mapping
server/src/services/<domain>      domain business rules, split by capability
server/src/repositories/<domain>  domain database queries, split by capability
server/src/integrations           external provider calls
shared/src                        cross-runtime contracts
packages/db                       Drizzle schema, connection, migrations, and development seed
packages/spotify                  future Spotify provider integration
tests/e2e                         future end-to-end tests
```

The server, shared, and database packages keep their `src/` directories. Paths without code are ownership rules, not implemented layers; create them when needed. `packages/spotify` remains a reserved directory and is not a workspace or integration.

### Server request and error flow

The room API is the current example of the backend boundary: route modules register Zod validation middleware and then a named handler; handlers read validated values from the Hono context and call the relevant service; services own domain rules; repositories own database queries. Keep service and repository modules grouped under the domain and split them by capability when the domain has distinct operations.

The root Hono app in `server/src/app.ts` registers `globalErrorHandler` once with `.onError(...)`. Expected service errors use `AppError`; validation middleware converts Zod issues into `ValidationError`; a database mapper converts recognized SQLSTATEs; and the global handler returns the shared API error envelope. The package entry point in `server/src/index.ts` re-exports the app.

### Frontend responsibilities

The frontend has two UI layers: generic shadcn/ui primitives in `client/src/components/ui/`, and product components inside their owning `client/src/features/<domain>/` feature. Product components compose foundation primitives; they do not belong in the shared primitive directory.

Within a feature, use `components/` for presentation, `hooks/` for React coordination, `api/` for backend communication, `queries/` for TanStack Query configuration, `services/` for framework-independent client logic, `utils/` for small explicit helpers, and `three/` for React Three Fiber / Three.js internals. These are ownership rules, not a requirement to create every folder. The rooms feature uses only the subdirectories needed by its current behavior.

The room feature owns its presentation, API calls, query hooks, guest session service, and scene code in `client/src/features/rooms/`. Its 3D internals stay under `features/rooms/three/`, rather than in route pages. The usual remote-data path is route/page → feature controller hook → query or mutation hook → query definition → API function → backend. Services support client-side calculations and transformations where needed; they are not a mandatory step in every request. Presentation composition runs route/page → product component → foundation UI.

Keep React presentation components focused on rendering and small UI state. Hooks coordinate React behavior without becoming catch-all logic modules. TanStack Query owns remote state; if Zustand is introduced, use it for genuine client-owned state rather than mirroring remote data. The backend remains authoritative for business and authorization rules even when the UI renders from server-provided permissions.

The BHVR starter route remains available at `/demo` as a typed Hono RPC example. New feature code should put backend calls behind feature API functions and should not copy the demo's inline arrangement as a requirement.

The shadcn/ui foundation is configured in the client and remains the generic primitive layer. The room experience uses custom feature components. Zustand remains unimplemented; keep current capabilities distinct from later product plans.

### Route generation and code splitting

Vite loads the TanStack Router plugin before the React plugin and enables `autoCodeSplitting`. Keep that shared configuration in `client/vite.config.ts`. TanStack Router generates `client/src/routeTree.gen.ts` from each product's route files, so the generated route list changes with the product while the generation pipeline stays the same.

Keep route component functions local to their route files so the plugin can split them. Do not export those component functions or hand-edit the generated route tree. The root route remains in the main bundle.

## Dependency direction

Client and server may use `shared`. Server repositories may use `packages/db`, and server integrations may use `packages/spotify` when that provider is approved. Reusable packages must not import client or server code. `shared` must not import application code or provider integrations.

The current client imports a browser-safe runtime helper from `server/client` for Hono RPC. This starter boundary is preserved to keep the demo working. Revisit it only with a coordinated change to the client and server; do not silently replace Hono RPC with an unrelated API style.

## Tradeoffs

| Choice | Benefit | Cost and control |
| --- | --- | --- |
| Bun monorepo | One lockfile and explicit workspace dependencies | Package configuration adds work; create only packages with an agreed owner. |
| Domain-first server folders | Keeps each domain's services and repositories grouped, with focused files for distinct capabilities | One feature can touch several layers; create domain folders when a domain has code and split by capability when responsibilities diverge. |
| Shared contracts | One definition for data both runtimes use | `shared` can become a dumping ground; keep implementation and secrets out. |
| Separate provider packages | Isolates external API and database details | Empty wrappers add maintenance; defer provider code until behavior is specified. |

The expected request path is route, handler, service, repository, database. Use only the layers a concrete feature needs. A simple starter route can remain simple.
