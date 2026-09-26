# Roadmap

This is an order of work, not a release date or an approved feature list.

## Current design sequence

Phase 1 room behavior exists. The next proposed work follows [design-flow.md](design-flow.md):

1. Review discovery, guest entry, active lounge, mobile, and recovery flows against the approved pastel concept.
2. Agree on a feasible character/furniture asset approach and complete the screen designs.
3. Redesign the client against the existing room API without changing the Phase 1 contract.
4. Resolve Spotify use-case constraints and the personal playback model before specifying provider backend behavior.
5. Design persistent identity and character customization before creating their services or tables.

The social-room design can progress while provider decisions remain open. Synchronized playback, games, commerce, chat, and room creation are not implied by this sequence.

## General delivery process

1. **Project guidance.** Keep `AGENTS.md`, tool adapters, and the engineering documents aligned with the repository. This stage adds no product behavior.
2. **Repository organization.** Keep the working `src/` layout in client, server, and shared, the existing `packages/db` infrastructure, and one root Bun lockfile. `packages/spotify` remains a future ownership path. Create directories when code needs them. Confirm which workspace tasks actually ran when reporting root `type-check` or `test` results.
3. **MVP definition.** Agree on the first user journey, data contracts, provider requirements, and acceptance criteria. Update `product.md` before creating feature domains.
4. **Feature delivery.** Implement one scoped feature at a time, with its needed tests and documentation. Add Drizzle, Spotify, 3D code, or background infrastructure only when an approved feature requires them.

Do not treat a later-stage item as permission to implement it during an earlier stage.
