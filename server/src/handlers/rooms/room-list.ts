import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import * as roomService from "../../services/room/room-service";

export async function roomListHandler(c: Context) {
	return c.json(await roomService.listRooms(), StatusCodes.OK);
}
