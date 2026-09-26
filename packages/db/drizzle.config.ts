import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL must be set to connect Drizzle Kit to PostgreSQL.",
	);
}

export default defineConfig({
	schema: "./src/schema/index.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
