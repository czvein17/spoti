import {
	IconArrowUpRight,
	IconHeadphones,
	IconUsers,
} from "@tabler/icons-react";
import type { RoomSummary } from "shared";

type RoomCardProps = {
	room: RoomSummary;
	onJoin: () => void;
};

export function RoomCard({ room, onJoin }: RoomCardProps) {
	return (
		<article className="room-card">
			<div className="room-poster" aria-hidden="true">
				<div className="room-poster-orbit room-poster-orbit-back" />
				<div className="room-poster-disc">
					<span className="room-poster-center">AH</span>
				</div>
				<div className="room-poster-light" />
				<span className="room-poster-caption">NIGHT SERVICE / VOL. 01</span>
			</div>

			<div className="room-card-content">
				<div className="room-card-kicker">
					<span className="room-open-indicator">
						<span className="room-open-dot" />
						Open now
					</span>
					<span className="room-index">ROOM 001</span>
				</div>

				<div className="room-card-heading">
					<div>
						<p className="eyebrow">Tonight's room</p>
						<h2>{room.name}</h2>
					</div>
					<div className="room-card-host">
						<span className="host-mark">
							<IconHeadphones size={16} stroke={1.6} aria-hidden="true" />
						</span>
						<span>{room.hostName}</span>
					</div>
				</div>

				<div className="room-card-details">
					<div className="room-track-preview">
						<span className="detail-label">On the turntable</span>
						<strong>{room.currentTrack.title}</strong>
						<span>{room.currentTrack.artist}</span>
					</div>
					<div className="room-audience-preview">
						<IconUsers size={17} stroke={1.6} aria-hidden="true" />
						<span>{room.memberCount} in the room</span>
					</div>
				</div>

				<button
					className="primary-button room-card-action"
					type="button"
					onClick={onJoin}
				>
					Enter the lounge
					<IconArrowUpRight size={18} stroke={1.7} aria-hidden="true" />
				</button>
			</div>
		</article>
	);
}
