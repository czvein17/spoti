# File organization

Use this guide to choose one owner for new code. Create a listed directory when it has a real file. See `docs/architecture.md` for the current boundaries and `docs/conventions.md` for naming and test placement.

| Need | Location | Rule |
| --- | --- | --- |
| URL page | `client/src/routes/` | Keep route files focused on routing and composition. |
| React feature | `client/src/features/<domain>/` | Add a domain folder when the feature has code. |
| Shared UI primitive | `client/src/components/ui/` | Use shadcn/ui for primitives only. Product-specific UI stays in its feature. |
| Feature presentation | `client/src/features/<domain>/components/` | Compose product UI from foundation primitives; see `docs/conventions.md`. |
| Feature React coordination | `client/src/features/<domain>/hooks/` | Keep hooks focused on React behavior and feature coordination. |
| Feature backend calls | `client/src/features/<domain>/api/` | Isolate typed RPC or HTTP calls from UI and query lifecycle. |
| Feature query configuration | `client/src/features/<domain>/queries/` | Keep TanStack Query keys and options reusable. |
| Feature client logic and helpers | `client/src/features/<domain>/services/` or `utils/` | Use services for framework-independent logic and utils for small explicit helpers. |
| Shared client hook, store, or helper | `client/src/hooks/`, `stores/`, or `lib/` | Use only for code genuinely shared across features. |
| Reusable 3D setup | `client/src/three/` | Feature-specific 3D code belongs in `features/<domain>/three/`. |
| Global styles | `client/src/styles/` | Keep feature styles near the feature where practical. |
| HTTP route registration | `server/src/routes/` | Map paths and middleware; do not hide business rules here. |
| HTTP action | `server/src/handlers/<domain>/<domain>-<action>.ts` | Handle validation result, service call, and response. |
| Business rule | `server/src/services/` | Keep it independent of HTTP transport. |
| Application query | `server/src/repositories/` | Use database infrastructure from `packages/db` once present. |
| Server-only validation | `server/src/schemas/` | Put a contract in `shared/src/schemas/` only if the client also needs it. |
| Middleware, configuration, or provider call | `server/src/middleware/`, `config/`, or `integrations/` | Keep secrets and provider SDKs on the server. |
| Cross-runtime type or constant | `shared/src/types/` or `shared/src/constants/` | Do not put application implementation in `shared`. |
| Database schema or migration | `packages/db/` | Do not put application repositories here. |
| Spotify provider code | `packages/spotify/` | Keep provider concepts separate from the product domain. |

Keep `client/src/routeTree.gen.ts` generated. Add an index file for a real public package interface, not for every folder. Avoid broad wildcard exports, speculative feature domains, and placeholder files added only to preserve empty directories.
