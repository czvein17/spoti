import { db, postgresClient } from "./client";
import { roomMembers, rooms } from "./schema";

const roomId = "2am-lounge";

try {
	await db
		.insert(rooms)
		.values({
			id: roomId,
			name: "2AM Lounge",
			status: "open",
			currentTrackTitle: "About You",
			currentTrackArtist: "The 1975",
		})
		.onConflictDoUpdate({
			target: rooms.id,
			set: {
				name: "2AM Lounge",
				status: "open",
				currentTrackTitle: "About You",
				currentTrackArtist: "The 1975",
				updatedAt: new Date(),
			},
		});

	await db
		.insert(roomMembers)
		.values([
			{
				id: "seed-dj-nova",
				roomId,
				guestName: "DJ Nova",
				role: "dj",
				spotId: "dj",
			},
			{
				id: "seed-listener-aya",
				roomId,
				guestName: "Aya",
				role: "listener",
				spotId: "couch-left",
			},
			{
				id: "seed-listener-milo",
				roomId,
				guestName: "Milo",
				role: "listener",
				spotId: "couch-right",
			},
			{
				id: "seed-listener-sage",
				roomId,
				guestName: "Sage",
				role: "listener",
				spotId: "standing-left",
			},
		])
		.onConflictDoNothing();

	console.log("Seeded 2AM Lounge with DJ Nova and three sample listeners.");
} finally {
	await postgresClient.end();
}
