import { randomUUID } from "node:crypto";
import { db } from "@untitle-project/db/client";
import { roomMembers, roomReactions, rooms } from "@untitle-project/db/schema";
import {
	and,
	asc,
	eq,
	gt,
	inArray,
	isNotNull,
	isNull,
	lte,
	or,
} from "drizzle-orm";
import type { RoomReaction, RoomSpotId, RoomSummary } from "shared";

function activeMembersSince(activeSince: Date) {
	return or(
		isNull(roomMembers.guestSessionId),
		gt(roomMembers.lastSeenAt, activeSince),
	);
}

function toSummary(
	room: typeof rooms.$inferSelect,
	memberCount: number,
	hostName: string,
): RoomSummary {
	return {
		id: room.id,
		name: room.name,
		hostName,
		status: room.status,
		memberCount,
		currentTrack: {
			title: room.currentTrackTitle,
			artist: room.currentTrackArtist,
		},
	};
}

export async function listRooms(activeSince: Date): Promise<RoomSummary[]> {
	const roomRows = await db
		.select()
		.from(rooms)
		.where(eq(rooms.status, "open"))
		.orderBy(asc(rooms.name));

	if (roomRows.length === 0) return [];

	const memberRows = await db
		.select({ roomId: roomMembers.roomId })
		.from(roomMembers)
		.where(
			and(
				inArray(
					roomMembers.roomId,
					roomRows.map((room) => room.id),
				),
				activeMembersSince(activeSince),
			),
		);
	const counts = new Map<string, number>();
	const hostRows = await db
		.select({ roomId: roomMembers.roomId, guestName: roomMembers.guestName })
		.from(roomMembers)
		.where(
			and(
				inArray(
					roomMembers.roomId,
					roomRows.map((room) => room.id),
				),
				eq(roomMembers.role, "dj"),
			),
		);
	const hostNames = new Map(
		hostRows.map((host) => [host.roomId, host.guestName]),
	);
	for (const member of memberRows) {
		counts.set(member.roomId, (counts.get(member.roomId) ?? 0) + 1);
	}

	return roomRows.map((room) =>
		toSummary(
			room,
			counts.get(room.id) ?? 0,
			hostNames.get(room.id) ?? "House DJ",
		),
	);
}

export async function getRoom(
	roomId: string,
	guestSessionId: string | undefined,
	activeSince: Date,
) {
	const [room] = await db
		.select()
		.from(rooms)
		.where(eq(rooms.id, roomId))
		.limit(1);
	if (!room) return null;

	const memberRows = await db
		.select()
		.from(roomMembers)
		.where(and(eq(roomMembers.roomId, roomId), activeMembersSince(activeSince)))
		.orderBy(asc(roomMembers.joinedAt));

	const memberIds = memberRows.map((member) => member.id);
	const reactionRows =
		memberIds.length === 0
			? []
			: await db
					.select({
						memberId: roomReactions.memberId,
						emoji: roomReactions.emoji,
					})
					.from(roomReactions)
					.where(inArray(roomReactions.memberId, memberIds));

	const reactionsByMember = new Map<string, RoomReaction[]>();
	const reactionCounts: Record<RoomReaction, number> = {
		heart: 0,
		fire: 0,
		cry: 0,
	};
	for (const reaction of reactionRows) {
		reactionsByMember.set(reaction.memberId, [
			...(reactionsByMember.get(reaction.memberId) ?? []),
			reaction.emoji,
		]);
		reactionCounts[reaction.emoji] += 1;
	}

	const members = memberRows.map((member) => ({
		id: member.id,
		guestName: member.guestName,
		role: member.role,
		spotId: member.spotId,
		reactions: reactionsByMember.get(member.id) ?? [],
	}));
	const myMember = memberRows.find(
		(member) => member.guestSessionId === guestSessionId,
	);

	return {
		summary: toSummary(
			room,
			members.length,
			members.find((member) => member.role === "dj")?.guestName ?? "House DJ",
		),
		members,
		reactionCounts,
		myReactions: myMember ? (reactionsByMember.get(myMember.id) ?? []) : [],
		myMemberId: myMember?.id,
	};
}

type JoinGuestInput = {
	roomId: string;
	guestSessionId: string;
	guestName: string;
	activeSince: Date;
	now: Date;
	availableSpotIds: readonly RoomSpotId[];
};

export async function joinGuest(input: JoinGuestInput) {
	return db.transaction(async (transaction) => {
		const [room] = await transaction
			.select({ id: rooms.id, status: rooms.status })
			.from(rooms)
			.where(eq(rooms.id, input.roomId))
			.limit(1)
			.for("update");

		if (!room) return { kind: "not-found" as const };
		if (room.status !== "open") return { kind: "closed" as const };

		await transaction
			.delete(roomMembers)
			.where(
				and(
					eq(roomMembers.roomId, input.roomId),
					isNotNull(roomMembers.guestSessionId),
					or(
						isNull(roomMembers.lastSeenAt),
						lte(roomMembers.lastSeenAt, input.activeSince),
					),
				),
			);

		const [existing] = await transaction
			.select()
			.from(roomMembers)
			.where(
				and(
					eq(roomMembers.roomId, input.roomId),
					eq(roomMembers.guestSessionId, input.guestSessionId),
				),
			)
			.limit(1);

		if (existing) {
			const [renewed] = await transaction
				.update(roomMembers)
				.set({ guestName: input.guestName, lastSeenAt: input.now })
				.where(eq(roomMembers.id, existing.id))
				.returning();
			return { kind: "joined" as const, member: renewed };
		}

		const occupiedRows = await transaction
			.select({ spotId: roomMembers.spotId })
			.from(roomMembers)
			.where(eq(roomMembers.roomId, input.roomId));
		const occupiedSpots = new Set(occupiedRows.map((member) => member.spotId));
		const spotId = input.availableSpotIds.find(
			(candidate) => !occupiedSpots.has(candidate),
		);

		if (!spotId) return { kind: "full" as const };

		const [member] = await transaction
			.insert(roomMembers)
			.values({
				id: randomUUID(),
				roomId: input.roomId,
				guestSessionId: input.guestSessionId,
				guestName: input.guestName,
				role: "listener",
				spotId,
				joinedAt: input.now,
				lastSeenAt: input.now,
			})
			.returning();

		return { kind: "joined" as const, member };
	});
}

export async function leaveRoom(
	roomId: string,
	guestSessionId: string,
): Promise<boolean> {
	const removed = await db
		.delete(roomMembers)
		.where(
			and(
				eq(roomMembers.roomId, roomId),
				eq(roomMembers.guestSessionId, guestSessionId),
			),
		)
		.returning({ id: roomMembers.id });

	return removed.length > 0;
}
