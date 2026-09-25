# Project instructions

Bun workspace: Vite/React client, Hono server, and shared TypeScript contracts. The Spotify social app is planned; treat code and manifests as current facts and future paths as proposals.

## Context loading

- Determine the task domain and smallest likely file set. Inspect those files first; expand only for a dependency.
- Read documentation only when relevant to the current task. Do not automatically read all files under `docs/`.
- Do not inspect unrelated features, packages, routes, or services unless required. Prefer the smallest possible working context for each task.
- For documentation or configuration work, use the requested files and direct references. Do not start development servers or run application tests unless required by the change.
- Use Playwright only when the user explicitly requests browser interaction or visual verification, or when debugging browser/UI behavior.

## Structure and rules

- `client/src` owns client behavior, `server/src` owns server behavior, and `shared/src` owns cross-runtime contracts. Use the root `bun.lock`; do not add another lockfile.
- Client and server may depend on `shared`; `shared` must not depend on application code. Keep provider secrets and server-only code out of the client.
- `client/src/routeTree.gen.ts` is generated. Do not edit it by hand.
- PostgreSQL, Drizzle, Spotify integration, and 3D character code are plans, not implemented capabilities.
- Prefer direct code; share rules only when it removes real duplication. Name handlers `<domain>-<action>.ts`. Colocate focused unit tests.
- For library, framework, SDK, API, CLI, or cloud-service questions, resolve the library in Context7 and query the exact concept. Use `docs/references.md` for focused official links.
- Run only relevant checks and confirm they executed real work. Root `type-check` and `test` currently have no matching workspace scripts. Report unverified work.
- Preserve unrelated changes; do not commit secrets, `.env` files, or generated build output.

## Documentation map

| Task | Read when needed |
| --- | --- |
| Product scope or sequencing | `docs/product.md`, `docs/roadmap.md` |
| Architecture or dependency boundaries | `docs/architecture.md` |
| Adding or moving code | `docs/file-organization.md` |
| Implementing or reviewing code | `docs/engineering-standards.md` |
| Naming or test placement | `docs/conventions.md` |
| Agent handoff or substantial workflow | `docs/agent-workflow.md` |
| Library or tool APIs | `docs/references.md` |
