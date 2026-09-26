# Agent workflow

`AGENTS.md` is the shared instruction entry point. Codex and OpenCode read it directly; `CLAUDE.md` imports it for Claude Code. Keep project rules in shared files so switching tools does not create divergent policy.

## Choose the working context

1. Classify the task: documentation/configuration, product scope, client, server, shared contract, or repository structure. Start with the paths named by the task.
2. Locate the smallest likely file set using a path-scoped search or file list. Read those files and their direct dependencies first; widen the search only when needed.
3. Open only the documentation listed for that task in `AGENTS.md`. Read `product.md` when product behavior needs a decision, not for routine edits. Distinguish current code from planned paths.
4. Before a substantial code change, identify the owner and acceptance criteria. For version-sensitive APIs, check the relevant package version and a focused official reference.
5. For a new feature or phase, establish the behavior, API/data flow, code ownership, and acceptance boundaries before editing. Use [design-flow.md](design-flow.md) for screen-driven work: map each action and recovery state to its contract and backend authority before adding services or tables. Distinguish approved visual choices from proposed features and unresolved provider behavior. Once the user approves a plan or directly requests implementation, carry it through without reopening settled choices. Ask only when an unresolved choice materially changes behavior or scope.

For documentation or configuration changes, inspect the target files and directly related configuration only. Do not read application features, start a server, or run application checks unless the change depends on them.

## During and after editing

1. Keep the diff focused. Preserve unrelated user changes and generated files.
2. Update a contract and its callers together. Update these docs when a boundary, command, or product decision changes.
3. Run only relevant checks and read the result. A root Turbo command can exit successfully while executing zero package tasks; confirm actual tasks ran before calling the check passed.
4. Report files changed, behavior changed, commands run with outcomes, and anything still unverified. Do not describe planned folders, packages, routes, or database behavior as implemented.
5. Follow the user's settled constraints and the active project standards. If implementation work exposes a real conflict with them, explain the conflict and update the plan before changing the agreed behavior.

## Tool adapters

| Tool | Project entry point | Notes |
| --- | --- | --- |
| Codex | `AGENTS.md`, `.codex/config.toml` | Codex discovers `AGENTS.md`; the project config supplies MCP connections for trusted projects. Start a new task or session after changing instructions. |
| Claude Code | `CLAUDE.md` importing `AGENTS.md` | The import keeps one shared rules file and works for Windows checkouts. |
| OpenCode | `AGENTS.md` | OpenCode V2 currently ignores `opencode.json` `instructions`; use the shared file for active rules. |

These files align project instructions. Model behavior and available tools can still differ, so use the same acceptance criteria and verification evidence when comparing outputs.

## MCP connections

Context7 is configured for Codex in `.codex/config.toml` using `CONTEXT7_API_KEY`. Claude Code and OpenCode have user-level connections on the current machine; other machines need their own connection and environment variable. Keep tokens out of Git. Check available connections with `codex mcp list`, `claude mcp list`, or `opencode mcp list` when diagnosing a connection.

The [Hono documentation index](https://hono.dev/llms.txt) is a reference, not an MCP endpoint. Use the task-specific pages in `docs/references.md` and query Context7 one concept at a time. For visible UI changes, use Playwright for one bounded desktop and mobile verification pass when the app can run. For other work, use it only for explicit browser requests or browser/UI debugging.

The adapter behavior above follows the current [Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md), [Claude Code memory guide](https://code.claude.com/docs/en/memory), and [OpenCode V2 instructions guide](https://opencode.ai/v2/docs/instructions). Recheck those guides before changing tool configuration.
