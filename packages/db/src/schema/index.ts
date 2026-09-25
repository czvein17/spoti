import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const roomStatus = pgEnum("room_status", ["open", "closed"]);
export const roomMemberRole = pgEnum("room_member_role", ["dj", "listener"]);
export const roomReactionEmoji = pgEnum("room_reaction_emoji", [
	"heart",
	"fire",
	"cry",
]);

export const rooms = pgTable("rooms", {
	id: text("id").primaryKey(),
	name: varchar("name", { length: 80 }).notNull(),
	status: roomStatus("status").notNull().default("open"),
	currentTrackTitle: varchar("current_track_title", { length: 160 }).notNull(),
	currentTrackArtist: varchar("current_track_artist", {
		length: 160,
	}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const roomMembers = pgTable(
	"room_members",
	{
		id: text("id").primaryKey(),
		roomId: text("room_id")
			.notNull()
			.references(() => rooms.id, { onDelete: "cascade" }),
		guestSessionId: varchar("guest_session_id", { length: 64 }),
		guestName: varchar("guest_name", { length: 24 }).notNull(),
		role: roomMemberRole("role").notNull(),
		spotId: varchar("spot_id", { length: 40 }).notNull(),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
	},
	(table) => [
		uniqueIndex("room_members_room_spot_unique").on(table.roomId, table.spotId),
		uniqueIndex("room_members_room_guest_session_unique").on(
			table.roomId,
			table.guestSessionId,
		),
	],
);

export const roomReactions = pgTable(
	"room_reactions",
	{
		memberId: text("member_id")
			.notNull()
			.references(() => roomMembers.id, { onDelete: "cascade" }),
		emoji: roomReactionEmoji("emoji").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.memberId, table.emoji] })],
);
