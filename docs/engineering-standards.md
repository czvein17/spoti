# Engineering standards

These standards apply when the repository organization task or a later feature is implemented. They guide decisions; they do not authorize product behavior that has not been specified.

## Design principles

- **Keep it simple.** Prefer a direct function and a clear module over a framework or abstraction that has no current caller.
- **Avoid speculative work.** Add packages, interfaces, caches, workers, and provider adapters when an actual requirement needs them.
- **Remove meaningful duplication.** Share business rules and contracts that must stay consistent. Repeated small syntax is acceptable when sharing it would couple unrelated features.
- **Give code one owner.** A route handles HTTP concerns, a service owns business rules, a repository owns application queries, and an integration owns provider calls. Do not move application behavior into `shared` or a database infrastructure package.
- **Make dependencies visible.** Declare runtime dependencies in the package that uses them. Keep imports within the boundaries in `architecture.md`.
- **Prefer explicit names.** Use names that describe the domain and action. Avoid catch-all files such as `utils.ts`, `manager.ts`, `actions.ts`, and `functions.ts` when a specific name is possible.

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
