import { StatusCodes } from "http-status-codes";
import type { RoomReaction } from "shared";
import { AppError } from "../../errors/app-error";
import * as roomReactionRepository from "../../repositories/room/room-reaction-repository";
import { guestActiveSince } from "./guest-lease";

export async function toggleReaction(
	roomId: string,
	guestSessionId: string,
	emoji: RoomReaction,
) {
	const active = await roomReactionRepository.toggleReaction({
		roomId,
		guestSessionId,
		emoji,
		activeSince: guestActiveSince(new Date()),
	});

	if (active === null) {
		throw new AppError({
			code: "membership_expired",
			message: "Your seat expired. Join the room again to react.",
			statusCode: StatusCodes.CONFLICT,
		});
	}

	return { active } as const;
}
