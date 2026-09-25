import { IconUsers } from "@tabler/icons-react";
import type { RoomSummary } from "shared";

export function RoomHud({ room }: { room: RoomSummary }) {
	return (
		<div className="room-hud">
			<div className="room-hud-title">
				<p className="eyebrow">Listening room</p>
				<strong>{room.name}</strong>
			</div>
			<span className="room-hud-audience">
				<IconUsers size={16} stroke={1.7} aria-hidden="true" />
				<span>
					{room.memberCount}
					<span className="sr-only"> people in the room</span>
				</span>
			</span>
		</div>
	);
}
