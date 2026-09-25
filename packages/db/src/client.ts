import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL must be set before the server starts.");
}

export const postgresClient = postgres(databaseUrl, {
	max: 10,
	idle_timeout: 20,
	connect_timeout: 10,
});

export const db = drizzle(postgresClient, { schema });

export async function checkDatabaseConnection(): Promise<void> {
	await postgresClient`SELECT 1`;
}
