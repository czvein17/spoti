import type { RoomDetail, RoomReaction, RoomSummary } from "shared";
import { apiClient } from "@lib/api-client";

type GuestHeaders = { "x-guest-session-id": string };
type JoinRoomResponse = {
	memberId: string;
	guestName: string;
	spotId: string;
};
type JsonResponse = {
	ok: boolean;
	json: () => Promise<unknown>;
};

async function readJson<T>(
	response: JsonResponse,
	fallbackMessage: string,
): Promise<T> {
	const result = (await response.json().catch(() => null)) as
		| { error?: { message?: string } }
		| T
		| null;

	if (!response.ok) {
		const message =
			result && typeof result === "object" && "error" in result
				? result.error?.message
				: undefined;
		throw new Error(message ?? fallbackMessage);
	}

	return result as T;
}

function guestHeaders(sessionId: string): GuestHeaders {
	return { "x-guest-session-id": sessionId };
}

export async function listRooms(): Promise<RoomSummary[]> {
	const response = await apiClient.api.v1.rooms.$get();
	return readJson(response, "Rooms are taking a moment to load.");
}

export async function getRoom(
	roomId: string,
	sessionId?: string,
): Promise<RoomDetail> {
	const response = await apiClient.api.v1.rooms[":roomId"].$get({
		param: { roomId },
		header: sessionId ? guestHeaders(sessionId) : {},
	});
	return readJson(response, "This room could not be loaded.");
}

export async function joinRoom(
	roomId: string,
	sessionId: string,
	guestName: string,
): Promise<JoinRoomResponse> {
	const response = await apiClient.api.v1.rooms[":roomId"].join.$post({
		param: { roomId },
		header: guestHeaders(sessionId),
		json: { guestName },
	});
	return readJson(response, "You could not join this room.");
}

export async function sendRoomHeartbeat(roomId: string, sessionId: string) {
	const response = await apiClient.api.v1.rooms[":roomId"].heartbeat.$post({
		param: { roomId },
		header: guestHeaders(sessionId),
	});
	return readJson<{ active: true }>(response, "Your room connection expired.");
}

export async function leaveRoom(roomId: string, sessionId: string) {
	const response = await apiClient.api.v1.rooms[":roomId"].leave.$post({
		param: { roomId },
		header: guestHeaders(sessionId),
	});
	return readJson<{ left: boolean }>(response, "You could not leave the room.");
}

export async function toggleRoomReaction(
	roomId: string,
	sessionId: string,
	emoji: RoomReaction,
) {
	const response = await apiClient.api.v1.rooms[":roomId"].reactions.$post({
		param: { roomId },
		header: guestHeaders(sessionId),
		json: { emoji },
	});
	return readJson<{ active: boolean }>(
		response,
		"Your reaction could not be sent.",
	);
}
