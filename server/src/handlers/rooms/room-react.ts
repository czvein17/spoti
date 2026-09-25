import { StatusCodes } from "http-status-codes";
import * as roomReactionService from "../../services/room/room-reaction-service";
import { roomIdFromContext } from "./room-id-from-context";
import type { RoomReactionContext } from "./room-request-context";

export async function roomReactHandler(c: RoomReactionContext) {
	const emoji = c.req.valid("json").emoji;
	const guestSessionId = c.req.valid("header")["x-guest-session-id"];

	return c.json(
		await roomReactionService.toggleReaction(
			roomIdFromContext(c),
			guestSessionId,
			emoji,
		),
		StatusCodes.OK,
	);
}
