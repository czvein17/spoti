import { checkDatabaseConnection, postgresClient } from "@app/db/client";
import { app } from "./app";

function getStartupErrorCode(error: unknown): string | undefined {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return undefined;
	}

	return typeof error.code === "string" ? error.code : undefined;
}

try {
	await checkDatabaseConnection();

	const server = Bun.serve({
		port: 3000,
		fetch: app.fetch,
	});

	console.log(`Server listening on ${server.url}`);
} catch (error: unknown) {
	await postgresClient.end().catch(() => undefined);

	const errorCode = getStartupErrorCode(error);
	const errorDetail = errorCode ? ` (error code: ${errorCode})` : "";
	console.error(
		`Server startup failed${errorDetail}. Check DATABASE_URL, PostgreSQL availability, and whether port 3000 is free.`,
	);
	process.exitCode = 1;
}
