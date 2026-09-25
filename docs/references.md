# Documentation references

Use these links to find the exact documentation page for a task. Check the installed package version and existing code before applying an example. Keep references as links to current sources; do not copy whole documentation sets into this repository.

## Hono

The official [Hono documentation index](https://hono.dev/llms.txt) is a short map of Hono's guides and API pages. Open the page relevant to the change:

| Task | Official page |
| --- | --- |
| Running Hono with Bun | [Bun getting started](https://hono.dev/docs/getting-started/bun) |
| Typed client and server routes | [RPC guide](https://hono.dev/docs/guides/rpc) |
| Request input | [Validation guide](https://hono.dev/docs/guides/validation) |
| Middleware composition | [Middleware guide](https://hono.dev/docs/guides/middleware) |
| CORS used by the starter server | [CORS middleware](https://hono.dev/docs/middleware/builtin/cors) |
| Hono context APIs | [Context reference](https://hono.dev/docs/api/context) |

Use the index to choose a different Hono page when the task requires one. Avoid loading [the full documentation file](https://hono.dev/llms-full.txt) for a narrow question.

## Client stack

The current client uses TanStack Router 1, TanStack Query 5, Vite 6, and React 19. Start with the page for the task instead of loading an entire documentation site. Recheck `client/package.json` after dependency upgrades.

| Task | Official page |
| --- | --- |
| TanStack Router with Vite | [Vite installation](https://tanstack.com/router/latest/docs/installation/with-vite) |
| Route file layout and naming | [File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing) |
| TanStack Query setup and basic use | [React quick start](https://tanstack.com/query/latest/docs/framework/react/quick-start) |
| Refreshing cached data after changes | [Query invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) |
| Vite development and build basics | [Vite 6 getting started](https://v6.vite.dev/guide/) |
| Vite configuration | [Vite 6 configuration](https://v6.vite.dev/config/) |
| Client environment variables | [Vite 6 env variables and modes](https://v6.vite.dev/guide/env-and-mode) |
| React component and state concepts | [Learn React](https://react.dev/learn) |
| React APIs and hooks | [React API reference](https://react.dev/reference/react) |

## Lookup order

1. For a library-specific task, inspect the relevant package manifest, code path, or available types to identify the API and version in use.
2. For a library-specific question, resolve its Context7 library ID and query one concept at a time. Avoid repeated broad queries and full-document dumps.
3. Open the specific official page above when more detail or source verification is needed. Add a new link only when repeated work makes it useful.
4. If sources conflict, report the difference and verify against the installed version before editing.
