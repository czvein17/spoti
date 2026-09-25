import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/app-error";

export function roomIdFromContext(c: Context): string {
	const roomId = c.req.param("roomId");

	if (roomId) return roomId;

	throw new AppError({
		code: "room_not_found",
		message: "This room is unavailable.",
		statusCode: StatusCodes.NOT_FOUND,
	});
}
