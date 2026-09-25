export const ROOM_REACTIONS = ["heart", "fire", "cry"] as const;
export type RoomReaction = (typeof ROOM_REACTIONS)[number];

export const ROOM_SPOT_IDS = [
	"couch-left",
	"couch-center",
	"couch-right",
	"standing-left",
	"standing-right",
] as const;
export type RoomSpotId = (typeof ROOM_SPOT_IDS)[number];

export type RoomMemberRole = "dj" | "listener";
export type RoomStatus = "open" | "closed";

export type CurrentTrack = {
	title: string;
	artist: string;
};

export type RoomSummary = {
	id: string;
	name: string;
	hostName: string;
	status: RoomStatus;
	memberCount: number;
	currentTrack: CurrentTrack;
};

export type RoomMember = {
	id: string;
	guestName: string;
	role: RoomMemberRole;
	spotId: string;
	reactions: RoomReaction[];
};

export type RoomDetail = RoomSummary & {
	members: RoomMember[];
	reactionCounts: Record<RoomReaction, number>;
	myReactions: RoomReaction[];
	isMember: boolean;
};
