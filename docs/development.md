# Local development

## PostgreSQL sandbox

The room feature connects to the PostgreSQL sandbox container configured for this development environment. Start or manage that container with its sandbox workflow; this repository does not provision or stop the database container. The current local environment connects through `localhost:1717` to the `lounge` database.

Set `DATABASE_URL` in `.env` to the connection string supplied for your sandbox. It has this general form:

```text
postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

Keep the real connection string in `.env`; that file is ignored by Git. Apply the committed schema and add the sample room:

```sh
bun run db:migrate
bun run db:seed
```

The seed command is safe to repeat. After changing the Drizzle schema, create a migration and apply it:

```sh
bun run db:generate
bun run db:migrate
```

## Start the application

Run the workspace from the repository root:

```sh
bun install
bun run dev
```

The browser API client uses the current page origin. During development, Vite proxies `/api` and `/hello` to the Hono server at `http://localhost:3000`, so browser requests stay same-origin. The server requires `DATABASE_URL` and checks that PostgreSQL is reachable before it starts listening. If the connection check fails, startup exits with an error. This check does not apply migrations; run `bun run db:migrate` after generating a schema migration.

In production, configure the hosting ingress to forward `/api/*` and `/hello` to Hono on the same public origin as the client. This repository has no production ingress configuration; a separate API origin would require cross-origin requests and CORS configuration.
