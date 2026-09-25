import { StatusCodes } from "http-status-codes";
import * as roomService from "../../services/room/room-service";
import { roomIdFromContext } from "./room-id-from-context";
import type { GuestSessionContext } from "./room-request-context";

export async function roomLeaveHandler(c: GuestSessionContext) {
	const guestSessionId = c.req.valid("header")["x-guest-session-id"];

	return c.json(
		await roomService.leaveRoom(roomIdFromContext(c), guestSessionId),
		StatusCodes.OK,
	);
}
