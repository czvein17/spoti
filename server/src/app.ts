import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { StatusCodes } from "http-status-codes";
import type { ApiResponse } from "shared";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { roomRoutes } from "./routes/room-routes";

export const app = new Hono()
	.use("*", logger())
	.onError(globalErrorHandler)
	.use(
		cors({
			allowHeaders: ["Content-Type", "X-Guest-Session-Id"],
		}),
	)
	.get("/", (c) => c.text("Hello Hono!"))
	.get("/hello", async (c) => {
		const data: ApiResponse = {
			message: "Hello BHVR!",
			success: true,
		};

		return c.json(data, { status: StatusCodes.OK });
	})
	.route("/api/v1/rooms", roomRoutes);

export default app;
