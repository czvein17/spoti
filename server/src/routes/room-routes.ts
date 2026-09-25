import { Hono } from "hono";
import { roomGetHandler } from "../handlers/rooms/room-get";
import { roomHeartbeatHandler } from "../handlers/rooms/room-heartbeat";
import { roomJoinHandler } from "../handlers/rooms/room-join";
import { roomLeaveHandler } from "../handlers/rooms/room-leave";
import { roomListHandler } from "../handlers/rooms/room-list";
import { roomReactHandler } from "../handlers/rooms/room-react";
import { validateRequest } from "../middleware/validate-request";
import {
	guestSessionHeaderSchema,
	joinRoomSchema,
	optionalGuestSessionHeaderSchema,
	roomReactionSchema,
} from "../schemas/room-schema";

export const roomRoutes = new Hono()
	.get("/", roomListHandler)
	.get(
		"/:roomId",
		validateRequest("header", optionalGuestSessionHeaderSchema),
		roomGetHandler,
	)
	.post(
		"/:roomId/join",
		validateRequest("header", guestSessionHeaderSchema),
		validateRequest("json", joinRoomSchema),
		roomJoinHandler,
	)
	.post(
		"/:roomId/heartbeat",
		validateRequest("header", guestSessionHeaderSchema),
		roomHeartbeatHandler,
	)
	.post(
		"/:roomId/leave",
		validateRequest("header", guestSessionHeaderSchema),
		roomLeaveHandler,
	)
	.post(
		"/:roomId/reactions",
		validateRequest("header", guestSessionHeaderSchema),
		validateRequest("json", roomReactionSchema),
		roomReactHandler,
	);
