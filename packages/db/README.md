# Database package boundary

Reserved for shared database infrastructure when an approved feature needs it. Drizzle, schemas, migrations, and database connections are not configured yet. Do not put application repositories here; they belong under `server/src/repositories/`.

This directory is not a Bun workspace package until it has code and a package manifest.
