import { StatusCodes } from "http-status-codes";
import * as roomService from "../../services/room/room-service";
import { roomIdFromContext } from "./room-id-from-context";
import type { OptionalGuestSessionContext } from "./room-request-context";

export async function roomGetHandler(c: OptionalGuestSessionContext) {
	const sessionId = c.req.valid("header")["x-guest-session-id"];

	return c.json(
		await roomService.getRoom(roomIdFromContext(c), sessionId),
		StatusCodes.OK,
	);
}
