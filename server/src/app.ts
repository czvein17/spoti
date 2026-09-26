import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { StatusCodes } from "http-status-codes";
import type { ApiResponse } from "shared";
import { corsConfig } from "./config/corsConfig";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { roomRoutes } from "./routes/room-routes";

export const app = new Hono()
	.use("*", logger())
	.use("*", secureHeaders())
	.use("*", cors(corsConfig))
	.onError(globalErrorHandler)
	.get("/hello", async (c) => {
		const data: ApiResponse = {
			message: "Hello BHVR!",
			success: true,
		};

		return c.json(data, { status: StatusCodes.OK });
	})
	.route("/api/v1/rooms", roomRoutes)
	.all("/api/*", (c) => c.notFound())
	.use("*", serveStatic({ root: "./client/dist" }))
	.get("*", serveStatic({ root: "./client/dist", path: "index.html" }));

export default app;
