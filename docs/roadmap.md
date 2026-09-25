# Roadmap

This is an order of work, not a release date or an approved feature list.

1. **Project guidance.** Keep `AGENTS.md`, tool adapters, and the engineering documents aligned with the repository. This stage adds no product behavior.
2. **Repository organization.** Keep the working `src/` layout in client, server, and shared; document the agreed ownership paths, reserve `packages/db` and `packages/spotify`, and use one root Bun lockfile. Create empty paths when code needs them. The root `type-check` and `test` commands still need package tasks before they can verify future features.
3. **MVP definition.** Agree on the first user journey, data contracts, provider requirements, and acceptance criteria. Update `product.md` before creating feature domains.
4. **Feature delivery.** Implement one scoped feature at a time, with its needed tests and documentation. Add Drizzle, Spotify, 3D code, or background infrastructure only when an approved feature requires them.

Do not treat a later-stage item as permission to implement it during an earlier stage.
