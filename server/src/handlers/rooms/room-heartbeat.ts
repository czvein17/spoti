import { StatusCodes } from "http-status-codes";
import * as roomPresenceService from "../../services/room/room-presence-service";
import { roomIdFromContext } from "./room-id-from-context";
import type { GuestSessionContext } from "./room-request-context";

export async function roomHeartbeatHandler(c: GuestSessionContext) {
	const guestSessionId = c.req.valid("header")["x-guest-session-id"];

	return c.json(
		await roomPresenceService.heartbeat(roomIdFromContext(c), guestSessionId),
		StatusCodes.OK,
	);
}
