# Local development

## Database

The room feature uses a local PostgreSQL service. Start it from the repository root:

```sh
bun run db:up
```

Set `DATABASE_URL` in `.env` to:

```text
postgres://lounge:lounge-local-only@localhost:5432/lounge
```

Apply the schema and add the sample room:

```sh
bun run db:generate
bun run db:migrate
bun run db:seed
```

The seed command is safe to repeat. Stop PostgreSQL while preserving its local data with `bun run db:stop`. The `lounge-postgres` volume belongs to this development setup; do not remove it to stop the service.

## Start the application

Run the workspace from the repository root:

```sh
bun install
bun run dev
```

The browser API client uses the current page origin. During development, Vite proxies `/api` and `/hello` to the Hono server at `http://localhost:3000`, so browser requests stay same-origin. The server requires `DATABASE_URL` and checks that PostgreSQL is reachable before it starts listening. If the connection check fails, startup exits with an error. This check does not apply migrations; keep using `bun run db:migrate` after schema changes.

In production, configure the hosting ingress to forward `/api/*` and `/hello` to Hono on the same public origin as the client. This repository has no production ingress configuration; a separate API origin would require cross-origin requests and CORS configuration.
