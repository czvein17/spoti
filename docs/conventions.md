# Conventions

These rules apply to new code. The BHVR demo remains a small working example; create a directory when its first real file needs a home. Do not refactor the starter route just to match the future feature layout.

## Frontend architecture

### UI layers

```text
UI SYSTEM
├── Foundation UI      → shadcn/ui primitives
└── Product Experience → custom feature components
```

- Keep generic, reusable primitives in `client/src/components/ui/`. Prefer shadcn/ui, preserve Radix accessibility behavior, and keep these components free of product behavior, API calls, realtime code, and Three.js.
- Keep product components such as a room player, queue, or avatar editor inside their owning feature. They may compose foundation primitives; do not turn product components into generic primitives or default every product surface to `Card`.

### Feature-owned responsibilities

Add only the subdirectories needed by real feature code:

```text
client/src/features/<domain>/
├── components/
├── hooks/
├── api/
├── queries/
├── services/
├── three/
└── utils/
```

| Location | Owns | Keep out |
| --- | --- | --- |
| `components/` | JSX, semantic HTML, styling, accessibility, composition, event wiring, simple rendering decisions, and small UI-only state | Business rules, raw backend calls, complex transformations, authorization, realtime implementation, and Three.js internals |
| `hooks/` | React lifecycle, TanStack Query integration, mutation composition, state synchronization, and focused controller composition | Unrelated responsibilities collected in a large generic hook |
| `api/` | Raw backend communication, including typed RPC or HTTP calls | JSX, React hooks, UI state, query lifecycle, and rendering decisions |
| `queries/` | TanStack Query keys, options, retry/stale/cache settings, and reusable invalidation definitions | Component rendering and duplicate key definitions in feature hooks |
| `services/` | Framework-independent client calculations, transformations, normalization, mapping, and orchestration | React imports and authoritative server business or authorization rules |
| `utils/` | Small, explicit formatting and support helpers | Generic `utils.ts`, `helpers.ts`, or `functions.ts` dumping grounds |
| `three/` | React Three Fiber and Three.js scene code, model loading, cameras, lighting, animation, materials, and scene helpers | Direct scene manipulation from ordinary pages and product UI |

Presentation components may contain small UI state and straightforward decisions, such as whether a dialog is open or an empty state should render. Keep application behavior out of them so their primary responsibility is clear from the JSX.

Hooks are React integration boundaries, not a replacement home for a large component's entire implementation. Prefer focused names such as `use-room-query.ts`, `use-room-join-mutation.ts`, `use-room-playback.ts`, and `use-room-controller.ts`; split unrelated concerns instead of creating `use-room.ts`, `use-app.ts`, or `use-everything.ts`.

Keep query keys and reusable query options in `queries/`; feature hooks consume them. Keep backend calls in `api/`, never as raw `fetch()` calls in presentation components. Services are optional and do not need to sit in every request path.

### State and authority

- TanStack Query owns remote state such as rooms, profiles, members, messages, and queues. Do not copy that state into Zustand without a concrete reason.
- Use local React state for small, temporary presentation concerns such as dialog visibility, selected tabs, expanded sections, and input drafts.
- If a feature uses Zustand, reserve it for genuine client-owned state such as editor selection, local interaction mode, camera preferences, or unsaved client configuration. Do not use it as a replacement for TanStack Query.
- The backend owns authoritative business and authorization rules. The UI may render from server-provided permissions, but the backend must enforce them.

### Data flow and review

```text
Route / page → feature controller hook → query or mutation hook → query definition → API function → backend
                                      ↘ service for framework-independent client logic

Route / page → product component → foundation UI primitive
Feature → feature 3D component → React Three Fiber / Three.js
```

Use a service only where client-side calculations or transformations are needed; it is not a mandatory layer between the API and backend. Keep ordinary product UI away from Three.js objects such as scenes, cameras, renderers, and animation mixers; expose higher-level components such as `<RoomScene />`.

When reviewing a component, ask: if the API implementation, backend business logic, or realtime provider changed, would this presentation component need a major rewrite? If so, move that responsibility behind a feature hook, API function, or service as appropriate. Do not replace a large component with an equally large hook; split by responsibility, not line count.

When creating frontend code, first choose its owner: presentation (`components/`), React coordination (`hooks/`), backend calls (`api/`), TanStack Query configuration (`queries/`), framework-independent client logic (`services/`), small explicit helpers (`utils/`), or 3D internals (`three/`).

## Placement and naming

- Keep URL entry points in `client/src/routes/` and product UI in `client/src/features/<domain>/`. Put reusable shadcn/ui primitives in `client/src/components/ui/`; feature-specific UI stays with its feature.
- Put reusable Three.js infrastructure in `client/src/three/` and feature-specific 3D code in `client/src/features/<domain>/three/` when those features exist.
- Put feature-specific hooks, backend calls, query configuration, client services, and helpers in the matching feature subfolders described above. Keep top-level `client/src/hooks/`, `stores/`, and `lib/` for code genuinely shared across features.
- Keep cross-runtime contracts in `shared/src/`. Put shared schemas, types, and constants in their matching folders. Do not move server-only validation or provider code into `shared`.
- Name handlers `<domain>-<action>.ts`, such as `room-create.ts`. Prefer specific names over catch-all `utils.ts` or `manager.ts` files.

### Server request and error handling

The request path is route → validation middleware → named handler → service capability → repository capability → database. Use only the layers a concrete feature needs.

- Keep route modules declarative. Register `validateRequest(target, schema)` middleware followed by the named handler directly. Do not wrap a handler in a route callback just to pass values from `c.req.valid(...)`; the handler reads validated JSON, headers, or query values from the Hono context itself.
- Keep handlers focused on HTTP work: read validated values and path parameters, call the appropriate service, and shape the successful response. Do not repeat `try/catch` or build error responses in each handler.
- Keep Zod schemas in `server/src/schemas/` unless the client also needs the schema. Put public `apiErrorCode` and `apiErrorMessage` metadata on each request schema. `validateRequest` turns Zod issues into `ValidationError`; do not maintain a parallel route-level validation error map.
- Throw `AppError` or a focused subclass from services for expected failures. Use `StatusCodes` from `http-status-codes` for status values. Let typed errors propagate to the one `globalErrorHandler` registered with `.onError(...)` on the root Hono app in `server/src/app.ts`.
- The global handler owns the `{ error: { code, message, fields? } }` response shape. It handles `AppError` and `ValidationError`, maps known database SQLSTATEs through the database error mapper, converts Hono `HTTPException`s, and logs unknown errors before returning a generic 500. Keep database messages and query details server-side.
- Catch locally only when the operation can recover, clean up, or translate an error specific to that operation.

### Domain and capability modules

Group server implementation by domain first, then split services and repositories by capability as real responsibilities diverge. Keep names aligned across layers and do not add folder-level barrel files without a real public interface. For example:

```text
server/src/services/room/
  room-service.ts                 # listRooms, getRoom, joinRoom, leaveRoom
  room-presence-service.ts        # heartbeat
  room-reaction-service.ts        # toggleReaction
  guest-lease.ts                  # shared room service rule

server/src/repositories/room/
  room-repository.ts              # listRooms, getRoom, joinGuest, leaveRoom
  room-presence-repository.ts     # heartbeat
  room-reaction-repository.ts     # toggleReaction
```

### Formatting

- Use Biome as the formatter and linter for JavaScript, TypeScript, JSON, and CSS. Workspace format-on-save selects the Biome extension; `bun run format` formats the repository and `bun run lint` runs lint checks. Keep editor defaults aligned with `biome.json`.

## Checks and generated files

- Keep a domain's service tests beside its core service when they exercise related services and repositories together (`room-service.test.ts`). Put cross-domain server integration tests in `server/tests/integration/` and end-to-end tests in `tests/e2e/`. Do not create mirrored global unit-test folders.
- Exercise route validation and API error responses through the exported root app so tests include the registered global error boundary. Test pure mapping and formatting helpers directly when that gives a more focused assertion.
- Use Bun and the root `bun.lock`. Do not add npm, pnpm, or Yarn lockfiles.
- Do not edit `client/src/routeTree.gen.ts` or generated build output by hand.
- Run relevant checks and confirm they executed real tasks. Root `bun run type-check` and `bun run test` use Turbo; inspect output to confirm which workspace scripts ran.

See [architecture](architecture.md) for boundaries, [file organization](file-organization.md) for locations, and [engineering standards](engineering-standards.md) for design principles.
