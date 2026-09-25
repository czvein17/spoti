import { db } from "@app/db/client";
import { roomMembers, roomReactions } from "@app/db/schema";
import { and, eq } from "drizzle-orm";
import type { RoomReaction } from "shared";

type ToggleReactionInput = {
	roomId: string;
	guestSessionId: string;
	emoji: RoomReaction;
	activeSince: Date;
};

export async function toggleReaction(input: ToggleReactionInput) {
	return db.transaction(async (transaction) => {
		const [member] = await transaction
			.select()
			.from(roomMembers)
			.where(
				and(
					eq(roomMembers.roomId, input.roomId),
					eq(roomMembers.guestSessionId, input.guestSessionId),
				),
			)
			.limit(1)
			.for("update");

		if (!member?.lastSeenAt || member.lastSeenAt <= input.activeSince) {
			return null;
		}

		const [existing] = await transaction
			.select({ memberId: roomReactions.memberId })
			.from(roomReactions)
			.where(
				and(
					eq(roomReactions.memberId, member.id),
					eq(roomReactions.emoji, input.emoji),
				),
			)
			.limit(1);

		if (existing) {
			await transaction
				.delete(roomReactions)
				.where(
					and(
						eq(roomReactions.memberId, member.id),
						eq(roomReactions.emoji, input.emoji),
					),
				);
			return false;
		}

		await transaction
			.insert(roomReactions)
			.values({ memberId: member.id, emoji: input.emoji });
		return true;
	});
}
