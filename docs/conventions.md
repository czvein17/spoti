# Conventions

These rules apply to new code. The BHVR demo remains a small working example; create a directory when its first real file needs a home.

## Placement and naming

- Keep URL entry points in `client/src/routes/` and product UI in `client/src/features/<domain>/`. Put reusable shadcn/ui primitives in `client/src/components/ui/`; feature-specific UI stays with its feature.
- Put reusable Three.js infrastructure in `client/src/three/` and feature-specific 3D code in `client/src/features/<domain>/three/` when those features exist.
- Keep HTTP route registration in `server/src/routes/`, request handling in `handlers/`, business rules in `services/`, application queries in `repositories/`, and provider calls in `integrations/`. The intended flow is route → handler → service → repository → database; use only layers a concrete feature needs.
- Keep cross-runtime contracts in `shared/src/`. Put shared schemas, types, and constants in their matching folders. Do not move server-only validation or provider code into `shared`.
- Name handlers `<domain>-<action>.ts`, such as `room-create.ts`. Prefer specific names over catch-all `utils.ts` or `manager.ts` files.

## Checks and generated files

- Colocate unit tests with their implementation (`room-create.test.ts`). Put future server integration tests in `server/tests/integration/` and end-to-end tests in `tests/e2e/`. Do not create mirrored global unit-test folders.
- Use Bun and the root `bun.lock`. Do not add npm, pnpm, or Yarn lockfiles.
- Do not edit `client/src/routeTree.gen.ts` or generated build output by hand.
- Run checks relevant to a change and confirm they executed actual tasks. The root `type-check` and `test` scripts currently have no matching workspace scripts.

See [architecture](architecture.md) for boundaries, [file organization](file-organization.md) for locations, and [engineering standards](engineering-standards.md) for design principles.
