import { db } from "@app/db/client";
import { roomMembers } from "@app/db/schema";
import { and, eq, gt } from "drizzle-orm";

export async function heartbeat(
	roomId: string,
	guestSessionId: string,
	activeSince: Date,
	now: Date,
): Promise<boolean> {
	const updated = await db
		.update(roomMembers)
		.set({ lastSeenAt: now })
		.where(
			and(
				eq(roomMembers.roomId, roomId),
				eq(roomMembers.guestSessionId, guestSessionId),
				gt(roomMembers.lastSeenAt, activeSince),
			),
		)
		.returning({ id: roomMembers.id });

	return updated.length > 0;
}
