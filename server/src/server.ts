import { checkDatabaseConnection, postgresClient } from "@app/db/client";
import { app } from "./app";

function getStartupErrorCode(error: unknown): string | undefined {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return undefined;
	}

	return typeof error.code === "string" ? error.code : undefined;
}

try {
	const port = Number(process.env.PORT ?? "3000");
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error("PORT must be an integer between 1 and 65535.");
	}

	await checkDatabaseConnection();

	const server = Bun.serve({
		port,
		fetch: app.fetch,
	});

	console.log(`Server listening on ${server.url}`);
} catch (error: unknown) {
	await postgresClient.end().catch(() => undefined);

	const errorCode = getStartupErrorCode(error);
	const errorDetail = errorCode ? ` (error code: ${errorCode})` : "";
	console.error(
		`Server startup failed${errorDetail}. Check PORT, DATABASE_URL, and PostgreSQL availability.`,
	);
	process.exitCode = 1;
}
