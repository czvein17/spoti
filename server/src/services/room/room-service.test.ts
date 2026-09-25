import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
} from "bun:test";
import { randomUUID } from "node:crypto";
import { db, postgresClient } from "@untitle-project/db/client";
import { roomMembers, rooms } from "@untitle-project/db/schema";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { ROOM_SPOT_IDS } from "shared";
import * as roomPresenceService from "./room-presence-service";
import * as roomReactionService from "./room-reaction-service";
import * as roomService from "./room-service";

describe("room service", () => {
	let roomId = "";
	const guestSessions = new Set<string>();

	beforeEach(async () => {
		roomId = `room-test-${randomUUID()}`;
		guestSessions.clear();
		await db.insert(rooms).values({
			id: roomId,
			name: "Service Test Lounge",
			status: "open",
			currentTrackTitle: "Test Track",
			currentTrackArtist: "Test Artist",
		});
		await db.insert(roomMembers).values({
			id: `${roomId}-dj`,
			roomId,
			guestName: "Test DJ",
			role: "dj",
			spotId: "dj",
		});
	});

	afterEach(async () => {
		await db.delete(rooms).where(eq(rooms.id, roomId));
	});

	afterAll(async () => {
		await postgresClient.end();
	});

	function newGuestSession() {
		const guestSessionId = randomUUID();
		guestSessions.add(guestSessionId);
		return guestSessionId;
	}

	it("returns the room, DJ, and empty reaction counts", async () => {
		const room = await roomService.getRoom(roomId);

		expect(room.name).toBe("Service Test Lounge");
		expect(room.hostName).toBe("Test DJ");
		expect(room.memberCount).toBe(1);
		expect(room.members[0]?.role).toBe("dj");
		expect(room.reactionCounts).toEqual({ heart: 0, fire: 0, cry: 0 });
	});

	it("assigns a spot and reuses it for a repeated join", async () => {
		const guestSessionId = newGuestSession();
		const first = await roomService.joinRoom(
			roomId,
			guestSessionId,
			"midnightfox",
		);
		const retry = await roomService.joinRoom(
			roomId,
			guestSessionId,
			"midnightfox",
		);
		const room = await roomService.getRoom(roomId, guestSessionId);

		expect(first.memberId).toBe(retry.memberId);
		expect(first.spotId).toBe(ROOM_SPOT_IDS[0]);
		expect(retry.spotId).toBe(first.spotId);
		expect(room.memberCount).toBe(2);
		expect(room.isMember).toBe(true);
	});

	it("toggles a reaction and reflects its count", async () => {
		const guestSessionId = newGuestSession();
		await roomService.joinRoom(roomId, guestSessionId, "cassettekid");

		await expect(
			roomReactionService.toggleReaction(roomId, guestSessionId, "heart"),
		).resolves.toEqual({ active: true });
		const reactedRoom = await roomService.getRoom(roomId, guestSessionId);
		expect(reactedRoom.myReactions).toEqual(["heart"]);
		expect(reactedRoom.reactionCounts.heart).toBe(1);

		await expect(
			roomReactionService.toggleReaction(roomId, guestSessionId, "heart"),
		).resolves.toEqual({ active: false });
		const clearedRoom = await roomService.getRoom(roomId, guestSessionId);
		expect(clearedRoom.myReactions).toEqual([]);
		expect(clearedRoom.reactionCounts.heart).toBe(0);
	});

	it("removes the guest and releases their spot when they leave", async () => {
		const guestSessionId = newGuestSession();
		await roomService.joinRoom(roomId, guestSessionId, "nightowl");

		expect(await roomService.leaveRoom(roomId, guestSessionId)).toEqual({
			left: true,
		});
		expect(await roomService.leaveRoom(roomId, guestSessionId)).toEqual({
			left: false,
		});
		expect((await roomService.getRoom(roomId)).memberCount).toBe(1);
	});

	it("rejects joins when all five listener spots are occupied", async () => {
		for (let index = 0; index < ROOM_SPOT_IDS.length; index += 1) {
			await roomService.joinRoom(
				roomId,
				newGuestSession(),
				`Guest ${index + 1}`,
			);
		}

		await expect(
			roomService.joinRoom(roomId, newGuestSession(), "One More"),
		).rejects.toMatchObject({
			code: "room_full",
			statusCode: StatusCodes.CONFLICT,
		});
	});

	it("expires an abandoned seat and assigns it on the next join", async () => {
		const guestSessionId = newGuestSession();
		const first = await roomService.joinRoom(
			roomId,
			guestSessionId,
			"lostsignal",
		);
		await db
			.update(roomMembers)
			.set({ lastSeenAt: new Date(Date.now() - 61_000) })
			.where(eq(roomMembers.id, first.memberId));

		await expect(
			roomPresenceService.heartbeat(roomId, guestSessionId),
		).rejects.toMatchObject({
			code: "membership_expired",
			statusCode: StatusCodes.CONFLICT,
		});

		const next = await roomService.joinRoom(
			roomId,
			guestSessionId,
			"lostsignal",
		);
		expect(next.memberId).not.toBe(first.memberId);
		expect(next.spotId).toBe(first.spotId);
	});
});
