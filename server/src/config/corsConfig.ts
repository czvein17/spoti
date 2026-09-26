import type { cors } from "hono/cors";

type CorsOptions = Parameters<typeof cors>[0];

export function parseAllowedOrigins(value: string | undefined): string[] {
	return (value ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
}

export function createCorsConfig(origins: string | undefined): CorsOptions {
	return {
		origin: parseAllowedOrigins(origins),
		allowHeaders: ["Content-Type", "Authorization", "X-Guest-Session-Id"],
	};
}

export const corsConfig = createCorsConfig(process.env.CORS_ORIGINS);
