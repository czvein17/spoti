# Untitled Project

This is a planned third-party Spotify app for socializing around music. Users will be able to browse what other people are currently listening to, jam together, or join a room. A character that each user can customize is planned for later. The project does not have a name yet, and the first MVP journey and detailed behavior still need to be selected.

## Where the project stands

| Area | Current state |
| --- | --- |
| Application | The BHVR starter page and a `GET /hello` demo API are working examples. |
| Client | Vite, React, TypeScript, TanStack Router, TanStack Query, and Tailwind CSS are configured. |
| Server | Hono runs with Bun and shares a typed RPC helper with the client. |
| Data and providers | PostgreSQL, Drizzle, Spotify integration, and 3D scenes are not implemented. |
| Product scope | The social music direction is set; the first MVP journey and acceptance criteria are still open. |

The repository documents where client features, server behavior, and shared contracts will live. Create each empty directory when it first has code. `packages/db` and `packages/spotify` are reserved by their READMEs; neither contains an integration. The current demo remains in place; see the [roadmap](docs/roadmap.md) for the order of work.

## Run the current demo

Use Bun from the repository root:

```sh
bun install
bun run dev
```

Run the apps separately with `bun run dev:client` and `bun run dev:server`. Build with `bun run build` and lint with `bun run lint`.

The root `type-check` and `test` scripts currently have no matching workspace package scripts, so they do not yet provide meaningful verification. Use the root `bun.lock` for installs.

## Repository map

| Path | Owner |
| --- | --- |
| [`client/`](client/README.md) | Browser application and UI. |
| [`server/`](server/README.md) | HTTP API and server behavior. |
| `shared/src/` | Shared contracts; schemas and constants get folders when needed. |
| `packages/db/`, `packages/spotify/` | Reserved integration boundaries; not workspace packages yet. |
| `tests/e2e/` | Reserved location for end-to-end tests. |
| [`docs/`](docs/architecture.md) | Architecture, engineering rules, product decisions, and roadmap. |

The server and shared code remain under their existing `src/` directories. See [file organization](docs/file-organization.md) for ownership rules; a documented path does not imply an implemented feature.

## Working agreements

Start with [AGENTS.md](AGENTS.md). The [engineering standards](docs/engineering-standards.md) describe DRY, KISS, YAGNI, interfaces, and verification; [conventions](docs/conventions.md) cover placement, names, and tests. The [architecture guide](docs/architecture.md) records dependency boundaries and tradeoffs. The [documentation references](docs/references.md) link to focused library pages. The [product brief](docs/product.md) records decisions as they are made, and the [agent workflow](docs/agent-workflow.md) keeps Codex, Claude Code, and OpenCode aligned on the same project rules.
