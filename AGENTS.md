# Project instructions

Bun workspace: Vite/React client, Hono server, and shared TypeScript contracts. The Spotify social app is planned; treat code and manifests as current facts and future paths as proposals.

## Context loading

- Determine the task domain and smallest likely file set. Inspect those files first; expand only for a dependency.
- Read documentation only when relevant to the current task. Do not automatically read all files under `docs/`.
- Do not inspect unrelated features, packages, routes, or services unless required. Prefer the smallest possible working context for each task.
- For documentation or configuration work, use the requested files and direct references. Do not start development servers or run application tests unless required by the change.
- For visible UI changes, use Playwright for one bounded verification pass at desktop, 390px, and 320px when the app can run. Check screenshots, horizontal overflow, keyboard focus, reduced motion, and relevant interaction states. Otherwise use Playwright only when the user requests browser interaction or visual verification, or when debugging browser/UI behavior.

## Structure and rules

- `client/src` owns client behavior, `server/src` owns server behavior, and `shared/src` owns cross-runtime contracts. Use the root `bun.lock`; do not add another lockfile.
- Keep frontend product components focused on presentation. Place React coordination, backend communication, TanStack Query configuration, framework-independent client logic, and 3D internals in their feature-owned layers; keep `components/ui` generic. Follow [frontend conventions](docs/conventions.md) and [architecture boundaries](docs/architecture.md), and create feature directories only when real code needs them.
- For server features, follow [engineering standards](docs/engineering-standards.md), [conventions](docs/conventions.md), and [file organization](docs/file-organization.md). Keep routes declarative, validate requests with the central `validateRequest` Zod middleware, throw expected `AppError`s from services, and let the root app's global handler shape errors. Group services and repositories by domain and capability.
- Client and server may depend on `shared`; `shared` must not depend on application code. Keep provider secrets and server-only code out of the client.
- `client/src/routeTree.gen.ts` is generated. Do not edit it by hand.
- PostgreSQL and Drizzle infrastructure exists in `packages/db`, and the room feature includes database-backed server behavior and a 3D scene. Spotify integration, account authentication, and character/avatar features remain planned capabilities.
- Prefer direct code; share rules only when it removes real duplication. Name handlers `<domain>-<action>.ts`. Colocate focused unit tests.
- Biome is the formatter and linter for this workspace. VS Code uses Biome on save; run `bun run format` for a repository-wide format pass and `bun run lint` for lint checks.
- Use Context7 only when an answer depends on current external library, framework, SDK, API, CLI, or cloud-service documentation, such as API syntax, setup, configuration, version migrations, or library-specific errors. Do not use it for repository-only work, refactoring, business logic, code review, general concepts, or questions answerable from local code and manifests. Use `docs/references.md` for focused official links.
- Run only relevant checks and confirm they executed real work. Root `bun run type-check` and `bun run test` use Turbo to run workspace tasks; report which tasks actually ran and any unverified work. Database-backed tests need `DATABASE_URL` and an available PostgreSQL instance.
- Preserve unrelated changes; do not commit secrets, `.env` files, or generated build output.

## Skill usage

- At the start of every task, review the available global skill catalog, classify the work, and read [skill routing](docs/skill-routing.md).
- Load every installed skill whose documented trigger directly matches the task. Combine compatible skills when the task spans categories.
- User requirements and repository rules take precedence over skill defaults. For overlapping UI skills, `impeccable` owns the workflow and visual direction; the other UI skills provide implementation rules and quality checks.
- For client work, distinguish visible UI from program logic. Use the core UI stack only when presentation or interaction changes. Route hooks, state, data fetching, API modules, queries, services, utilities, storage, and other non-visual behavior through the client program logic rules.
- Keep specialist skills inactive unless the request matches their trigger. Do not install a missing skill unless the user asks.

## Documentation map

| Task | Read when needed |
| --- | --- |
| Product scope or sequencing | `docs/product.md`, `docs/roadmap.md` |
| Skill selection for any task | `docs/skill-routing.md` |
| UI flows or backend behavior derived from screens | `docs/design-flow.md` |
| Architecture or dependency boundaries | `docs/architecture.md` |
| Adding or moving code | `docs/file-organization.md` |
| Implementing or reviewing code | `docs/engineering-standards.md` |
| Naming or test placement | `docs/conventions.md` |
| Agent handoff or substantial workflow | `docs/agent-workflow.md` |
| Library or tool APIs | `docs/references.md` |
