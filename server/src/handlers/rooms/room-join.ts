import { StatusCodes } from "http-status-codes";
import * as roomService from "../../services/room/room-service";
import { roomIdFromContext } from "./room-id-from-context";
import type { RoomJoinContext } from "./room-request-context";

export async function roomJoinHandler(c: RoomJoinContext) {
	const guestName = c.req.valid("json").guestName;
	const guestSessionId = c.req.valid("header")["x-guest-session-id"];

	return c.json(
		await roomService.joinRoom(roomIdFromContext(c), guestSessionId, guestName),
		StatusCodes.OK,
	);
}
