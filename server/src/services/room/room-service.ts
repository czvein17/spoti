import { StatusCodes } from "http-status-codes";
import { ROOM_SPOT_IDS, type RoomDetail, type RoomSummary } from "shared";
import { AppError } from "../../errors/app-error";
import * as roomRepository from "../../repositories/room/room-repository";
import { guestActiveSince } from "./guest-lease";

export async function listRooms(): Promise<RoomSummary[]> {
	return roomRepository.listRooms(guestActiveSince(new Date()));
}

export async function getRoom(
	roomId: string,
	guestSessionId?: string,
): Promise<RoomDetail> {
	const room = await roomRepository.getRoom(
		roomId,
		guestSessionId,
		guestActiveSince(new Date()),
	);

	if (!room) {
		throw new AppError({
			code: "room_not_found",
			message: "This room is no longer available.",
			statusCode: StatusCodes.NOT_FOUND,
		});
	}

	return {
		...room.summary,
		members: room.members,
		reactionCounts: room.reactionCounts,
		myReactions: room.myReactions,
		isMember: Boolean(room.myMemberId),
	};
}

export async function joinRoom(
	roomId: string,
	guestSessionId: string,
	guestName: string,
) {
	const result = await roomRepository.joinGuest({
		roomId,
		guestSessionId,
		guestName,
		activeSince: guestActiveSince(new Date()),
		now: new Date(),
		availableSpotIds: ROOM_SPOT_IDS,
	});

	switch (result.kind) {
		case "not-found":
			throw new AppError({
				code: "room_not_found",
				message: "This room is no longer available.",
				statusCode: StatusCodes.NOT_FOUND,
			});

		case "closed":
			throw new AppError({
				code: "room_closed",
				message: "This room is closed right now.",
				statusCode: StatusCodes.CONFLICT,
			});
		case "full":
			throw new AppError({
				code: "room_full",
				message: "All five listener spots are taken. Try again in a moment.",
				statusCode: StatusCodes.CONFLICT,
			});
	}

	if (!result.member) {
		throw new Error("The room member record was not created.");
	}

	return {
		memberId: result.member.id,
		guestName: result.member.guestName,
		spotId: result.member.spotId,
	};
}

export async function leaveRoom(roomId: string, guestSessionId: string) {
	const left = await roomRepository.leaveRoom(roomId, guestSessionId);
	return { left } as const;
}
