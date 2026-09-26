# Skill routing

Use this reference at the start of every task. Review the current available-skills catalog because global installations can change between sessions. Select skills from their documented triggers, then read each selected `SKILL.md` before working.

## Selection rules

1. Classify the request into every task category it contains.
2. Load every installed skill that directly matches those categories. A task may need several compatible skills.
3. Follow the user request first, then repository instructions, then task-specific skills, then general skills.
4. Keep specialist skills inactive when their trigger does not match. Do not install missing skills unless the user asks.
5. Run the checks required by the change and report anything that could not be verified.

For overlapping UI skills, `impeccable` owns the workflow and visual direction. Other UI skills add implementation rules and quality checks without replacing the approved brief.

## Project task routing

| Task | Skills | Use when |
| --- | --- | --- |
| Planning and requirements | `creating-development-plans`, `grill-me`, `widget-forms` | Use the planning skill for a requested development plan, `grill-me` for a requested design interview, and forms when structured input would materially improve the task. |
| General coding | `ponytail`, `typescript-development` | Use `ponytail` for coding, design, refactoring, debugging, and review. Use the TypeScript skill for every TypeScript or JavaScript task. |
| Code quality | `clean-code`, `clean-code-typescript` | Use for explicit readability, naming, maintainability, code-smell, or clean-code work. Prefer the TypeScript-specific skill for TypeScript and JavaScript. |
| Bugs and failed checks | `systematic-debugging` | Use before proposing or applying a fix for a bug, test failure, or unexpected behavior. |
| Review and completion | `self-review`, `code-review` | Use self-review before reporting non-trivial changes complete. Add code review after complex multi-part work or for a formal review. |
| Current external documentation | `context7-mcp` | Use when the answer depends on current library, framework, SDK, API, CLI, or cloud behavior. Prefer local files when they already answer the question. |
| Frontend implementation | `impeccable`, `frontend-design`, `design-taste-frontend`, `ui-design`, `emil-design-eng`, `ui-ux-pro-max`, `anti-ui-slop`, `vercel-react-best-practices`, `shadcn`, `typescript-development`, `ponytail`, `unslop` | Use the complete stack for visible React UI creation, redesign, refinement, or component work. |
| Client program logic | `typescript-development`, `ponytail`, `vercel-react-best-practices` | Use for hooks, state, data fetching, API modules, TanStack Query configuration, services, validation, browser storage, utilities, and non-visual React behavior. Follow `docs/architecture.md`, `docs/conventions.md`, and `docs/engineering-standards.md`. Add UI skills only when presentation or interaction changes. |
| Backend, API, shared contracts, and database | `typescript-development`, `ponytail`, `systematic-debugging`, `context7-mcp` | Apply the first two for implementation. Add debugging for failures and Context7 only for current Bun, Hono, Zod, Drizzle, or PostgreSQL behavior. |
| Better Auth setup | `create-auth`, `better-auth-best-practices` | Use when adding or configuring Better Auth. |
| Authentication hardening | `better-auth-security-best-practices`, `email-and-password-best-practices`, `two-factor-authentication-best-practices`, `organization-best-practices` | Add only the skills that match the requested security, credential, two-factor, organization, team, or role capability. |
| Docker and containers | `docker-patterns` | Use for Dockerfiles, Compose, networking, volumes, installer validation, or container security. |
| Architecture | `improve-codebase-architecture` | Use for a requested architecture audit or deep structural improvement analysis. |
| Diagrams | `excalidraw-diagram-generator` | Use when the user requests a diagram, flowchart, mind map, or Excalidraw artifact. |
| Documentation | `documentation-writer`, `unslop` | Use for substantial technical documentation. Apply `unslop` to prose, README content, and user-facing copy. |
| Brand copy | `brand-voice-enforcement` | Use when the user asks for branded or on-brand writing. |
| Git commits | `git-commit` | Use only when the user requests a commit. |
| Skill discovery and authoring | `find-skills`, `skill-creator` | Use skill discovery for capability searches and skill creator for creating or changing a skill. |
| Communication style | `caveman` | Use only when the user requests concise or token-efficient communication. Preserve its conversation-level persistence until the user disables it. |

## Specialized frontend routing

| Task | Skill |
| --- | --- |
| UI inspiration, comparable products, or flow research | `ui-radar` |
| Rendered UI scoring or generic-design review | `ui-slop-score` |
| Explicit UI, UX, or accessibility audit | `web-design-guidelines` |
| Screenshot-led or image-first implementation | `image-to-code` |
| New generated visual assets | `image-gen` |
| Animation, page transitions, or micro-interactions | `framer-motion-animator` |
| Design primitives extracted from a public site | `extract-design-system` |
| TanStack Router splitting or bundle work | `code-splitting` |
| Explicit Radix-to-Base migration | `migrate-radix-to-base` |

For visible UI changes, run one bounded Playwright pass when the app can run. Check desktop, 390px, and 320px layouts, screenshots, horizontal overflow, keyboard focus, reduced motion, and relevant interaction states. Report the check as blocked when the browser, application, server, or database is unavailable.

## Tools and specialized outputs

| Task | Skills |
| --- | --- |
| Orca worktrees, terminals, repositories, artifacts, or embedded browser | `orca-cli` |
| Coordinated multi-agent task graphs or supervised delegation | `orchestration` |
| Native applications or external browser windows | `computer-use` |
| Web research, extraction, or page automation | `web-browser` |
| Browser extension development | `browser-extension-builder`, `chrome-extension-development`, `chrome-extensions`, `crxjs` |
| Brand identity and visual brand systems | `brandkit` |
| Remotion video work | `remotion-best-practices` and the matching Remotion specialist skill |
| Product promos, motion graphics, avatars, music, voice, transcription, video, shaders, or visual analysis | Load the directly matching installed media skill only when the request includes that output. |

The catalog is broader than this repository. For any unlisted task, inspect the current skill descriptions and load only direct matches.
