import type { RoomSpotId } from "shared";

export type RoomPositionId = "dj" | RoomSpotId;
export type RoomPosition = {
	position: [number, number, number];
	yaw: number;
};

export const ROOM_POSITIONS: Record<RoomPositionId, RoomPosition> = {
	dj: { position: [0, 0.13, -2.45], yaw: Math.PI },
	"couch-left": { position: [-2.7, 0.02, 0.15], yaw: 0.5 },
	"couch-center": { position: [0, 0.02, 1.25], yaw: Math.PI },
	"couch-right": { position: [2.7, 0.02, 0.15], yaw: -0.5 },
	"standing-left": { position: [-1.35, 0.02, 2.35], yaw: 2.65 },
	"standing-right": { position: [1.35, 0.02, 2.35], yaw: -2.65 },
};

export function isRoomPositionId(value: string): value is RoomPositionId {
	return value in ROOM_POSITIONS;
}
