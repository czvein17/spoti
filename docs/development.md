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

The two network variables in `.env.example` are optional:

- `API_PROXY_TARGET` overrides the Vite proxy target. Leave it unset when Hono runs at `http://localhost:3000`.
- `CORS_ORIGINS` allows browsers on other origins to call Hono directly. Leave it unset when the browser uses the Vite proxy or Hono returns the production client.

## Start the application

Run the workspace from the repository root:

```sh
bun install
bun run dev
```

The browser API client uses the current page origin. During development, Vite proxies `/api` and `/hello` to the Hono server at `http://localhost:3000` by default, so browser requests stay same-origin. The server requires `DATABASE_URL` and checks that PostgreSQL is reachable before it starts listening. If the connection check fails, startup exits with an error. This check does not apply migrations; run `bun run db:migrate` after generating a schema migration.

## Production-style run

Build every workspace, then start Hono from the repository root:

```sh
bun run build
bun run start
```

Open `http://localhost:3000`. Hono returns files from `client/dist`, supports the client-side route fallback, and handles `/api/*` and `/hello` on the same origin. Run the build again after changing client code.

An unset `CORS_ORIGINS` value permits no cross-origin browser origin. This is the default because both development and production use same-origin browser requests. If a deployment separates the frontend and API, set `CORS_ORIGINS` to a comma-separated list of exact frontend origins. Credentialed CORS remains disabled.

Run `bun run test` from the repository root. The server test task loads the root `.env` when it exists. In continuous integration, provide `DATABASE_URL` through the job environment.
