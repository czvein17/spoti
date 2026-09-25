import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/app-error";
import * as roomPresenceRepository from "../../repositories/room/room-presence-repository";
import { guestActiveSince } from "./guest-lease";

export async function heartbeat(roomId: string, guestSessionId: string) {
	const active = await roomPresenceRepository.heartbeat(
		roomId,
		guestSessionId,
		guestActiveSince(new Date()),
		new Date(),
	);

	if (!active) {
		throw new AppError({
			code: "membership_expired",
			message: "Your seat expired. Join the room again to return.",
			statusCode: StatusCodes.CONFLICT,
		});
	}

	return { active } as const;
}
