# Engineering standards

These standards apply to current code and future features. They guide implementation choices; product behavior still follows the approved product scope.

## Design principles

- **Keep it simple.** Prefer a direct function and a clear module over a framework or abstraction that has no current caller.
- **Avoid speculative work.** Add packages, interfaces, caches, workers, and provider adapters when an actual requirement needs them.
- **Remove meaningful duplication.** Share business rules and contracts that must stay consistent. Repeated small syntax is acceptable when sharing it would couple unrelated features.
- **Give code one owner.** A route handles HTTP concerns, a service owns business rules, a repository owns application queries, and an integration owns provider calls. Do not move application behavior into `shared` or a database infrastructure package.
- **Group server code by domain and capability.** Put services in `server/src/services/<domain>/` and repositories in `server/src/repositories/<domain>/`. Split a domain into focused capability modules when its responsibilities diverge, and align service and repository names for matching capabilities. Keep closely related operations in the core domain service; add no barrel file just to re-export a folder.
- **Validate at the HTTP boundary.** Define request rules with Zod schemas and attach public API `apiErrorCode` and `apiErrorMessage` in schema metadata. Apply `validateRequest(target, schema)` in the route before the handler. It converts Zod issues into `ValidationError`; keep public validation messages with the schema instead of maintaining route-local error maps.
- **Keep routes declarative.** Register validation middleware followed by the named handler directly. Do not extract validated fields into route callback arguments. The handler reads them with `c.req.valid(...)`, reads path parameters from the context, calls the service, and returns the success response.
- **Centralize API error translation.** Register `globalErrorHandler` once with `.onError(...)` on the root Hono app in `server/src/app.ts`. It maps `AppError` (including `ValidationError`), recognized database SQLSTATEs, and Hono HTTP exceptions into `{ error: { code, message, fields? } }`; it logs unknown errors and returns a generic 500 response. Keep database details out of client responses. Use a focused database mapper for known SQLSTATEs.
- **Use typed expected errors.** Services throw `AppError` (or a focused subclass) for expected failures, with `StatusCodes` from `http-status-codes` for HTTP statuses. Let these errors propagate to the global handler. Catch locally only when the operation can recover, clean up, or translate an operation-specific error.
- **Use Biome consistently.** The root `biome.json` defines formatting and lint rules, `.vscode/settings.json` selects Biome for format-on-save, and `bun run format` applies formatting across the repository. Keep Prettier from becoming the default formatter for files handled by Biome.
- **Make dependencies visible.** Declare runtime dependencies in the package that uses them. Keep imports within the boundaries in `architecture.md`.
- **Prefer explicit names.** Use names that describe the domain and action. Avoid catch-all files such as `utils.ts`, `manager.ts`, `actions.ts`, and `functions.ts` when a specific name is possible.

### Current database error mappings

The focused mapper in `server/src/errors/database-error.ts` exposes these stable API outcomes:

| PostgreSQL SQLSTATE | HTTP status | API code |
| --- | --- | --- |
| `23505` unique violation | 409 Conflict | `duplicate_record` |
| `23503` foreign-key violation | 409 Conflict | `resource_relation_conflict` |
| `22P02` invalid text representation | 400 Bad Request | `invalid_data` |
| `23514` check violation | 400 Bad Request | `invalid_data` |
| `40001` serialization failure | 503 Service Unavailable | `database_retry` |
| `40P01` deadlock detected | 503 Service Unavailable | `database_retry` |

Keep database driver details out of responses. Add a mapping only when the SQLSTATE has a safe, stable client meaning, and test its status, API code, and response message through the Hono error boundary.

## TypeScript and interfaces

- Keep strict TypeScript settings. Validate untrusted input at the boundary before business logic uses it.
- Define shared request and response contracts only when both client and server need them. TypeScript types alone do not validate runtime data.
- Keep secrets and server-only dependencies out of the client bundle. Use environment variables for configuration and document any new required variable.
- Change a public contract and its callers together. Keep generated files generated.

## Change quality

1. Confirm the requested behavior, constraints, and acceptance criteria. Inspect the code path and package versions involved.
2. Make the smallest coherent change. Keep related tests beside the code and update documentation when ownership or behavior changes.
3. Run applicable build, type, lint, and focused behavior checks. Confirm each command executed real work rather than returning successfully with zero tasks.
4. Report what changed, what was verified, and any remaining limitation. Do not claim database or provider behavior was checked without running it.

Use `docs/file-organization.md` for placement, `docs/conventions.md` for names and test locations, and `docs/agent-workflow.md` for the agent handoff format.
