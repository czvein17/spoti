# Database package

This workspace package owns shared PostgreSQL infrastructure: the Drizzle schema, connection client, generated migrations, and development seed. Application queries and room rules stay in `server/src/repositories/` and `server/src/services/`.

Run the database commands from the repository root. The local PostgreSQL setup and `DATABASE_URL` are documented in [local development](../../docs/development.md).

The seed is safe to repeat. It upserts the room and inserts the DJ and sample listeners only when those seeded member IDs do not already exist. It keeps guest memberships and reactions intact.
