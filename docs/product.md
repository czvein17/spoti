# Product brief

This is a web-first social music experience. People enter as lightweight guest identities and spend time together in small, hosted listening rooms represented by customizable music personas in later phases. Afterhours is the working name; the final project name is undecided.

## Approved design direction

Use a cozy pastel lounge with cream, mint, peach, and lilac, rounded controls, and characters as the main visual focus. Spotify is the intended music provider; the application owns social rooms and future character styling. Spotify playback, synchronized listening, and game mechanics are not approved implementation assumptions.

The [design flow](design-flow.md) records the approved concept, screen journeys, recovery states, current API mapping, and unresolved provider decisions. Review the relevant flow before adding backend capabilities. The visual redesign retains the Phase 1 behavior below.

## Phase 1 audience and goal

The audience is a first-time visitor who wants to explore a shared music room without creating an account. Phase 1 must answer one question: can a guest enter a small 3D lounge, recognize the DJ and other listeners, see what the room is playing, and react to it?

The Phase 1 journey is:

```text
Room list → enter a display name → join the seeded lounge → see the 3D room and track → react → leave
```

## Selected Phase 1 behavior

- The room list contains one public seeded room, `2AM Lounge`, hosted by `DJ Nova`.
- The room begins with three seeded listener examples and one mock track, `About You — The 1975`. Track information is metadata only; Phase 1 does not stream audio.
- A guest enters a display name before joining. The browser creates a random, tab-scoped guest session ID and keeps the name and ID in `sessionStorage`. No password, account, profile, or provider login is required.
- A room has one DJ position and five listener positions. Joining assigns the next available listener position. A repeated join from the same guest session returns its existing membership. A full room returns a clear conflict response.
- Guests send a presence heartbeat every 20 seconds. Membership expires after 60 seconds without a heartbeat. Leaving removes the guest membership and its reactions immediately.
- Room state refreshes every five seconds through TanStack Query. No WebSockets, Redis, or distributed presence service is used.
- The room has a fixed isometric-style camera, simple booth and lighting, and lightweight procedural placeholder avatars. DJ and listener positions are predetermined. There is no walking or free movement.
- Guests can toggle each of ❤️, 🔥, and 😭 once. Counts are stored per active member, update immediately for the actor, and appear to other guests through room polling. Reaction history is not retained.
- The room scene occupies the main page area. Product-specific UI stays custom; shadcn/ui remains the primitive layer.

## Data ownership

- PostgreSQL owns the seeded room and mock track metadata, active room memberships, assigned spots, and current reactions.
- `packages/db` owns Drizzle schema, connection setup, migrations, and development seeding. Application queries belong in `server/src/repositories/`.
- A guest session ID is an anonymous, temporary browser identifier, not an authenticated identity. The server remains authoritative for membership, capacity, spot assignment, and reaction counts.
- The seeded DJ is represented as a room member with the `dj` role. Phase 1 does not create a user or profile table.
- The room feature exposes cross-runtime request and response types from `shared/src/`; server-only input validation remains in `server/src/schemas/`.

## Failure behavior

- Blank display names are rejected. Names are trimmed and limited to 24 characters; duplicate display names are allowed.
- A missing room returns not found. A full room returns conflict and leaves the guest outside the scene.
- A guest whose membership expired must rejoin before reacting. Retrying an active join is safe and does not reserve a second spot.
- Leaving an already-ended membership is safe. Network failures show an actionable retry state and do not silently discard the entered name.
- Invalid reaction values are rejected. Only the three Phase 1 reactions are accepted.

## Non-goals

Phase 1 does not include Spotify OAuth or playback, Apple Music, full authentication, permanent profiles, avatar customization or cosmetics, room creation or customization, queues or song requests, chat or private messages, friends, recommendations, AI DJ features, voice chat, Redis, workers, microservices, mobile apps, open-world movement, physics, or advanced avatar animation.

## Acceptance criteria

1. The application starts with Bun and a documented PostgreSQL sandbox setup.
2. Drizzle migrations apply, and an idempotent seed creates the room, DJ, three sample listeners, and mock track.
3. The home page lists the available room and lets a guest enter a display name.
4. A guest joins with a unique available listener spot; retries do not create duplicate memberships; full capacity is handled cleanly.
5. The room shows a fixed-camera 3D lounge, the DJ at the booth, and listeners at predefined positions.
6. The room HUD shows the room name, active audience, mock track, and reaction counts.
7. Guests can toggle reactions; local feedback is immediate and shared room state refreshes within the polling interval.
8. Leaving frees the spot, and an abandoned guest membership expires after its lease.
9. Desktop and narrow mobile layouts work at 390px and 320px without horizontal page overflow.
10. Presentation components contain no raw backend calls or business rules; 3D internals stay in the room feature; server behavior follows route → handler → service → repository.
11. Relevant unit and database-backed behavior tests, type-check, lint, and build checks pass.

The BHVR starter demo remains available at `/demo`. The client home page becomes room discovery. Spotify and later platform behavior remain future work.
