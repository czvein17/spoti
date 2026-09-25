import { IconVinyl } from "@tabler/icons-react";
import type { CurrentTrack } from "shared";

export function NowPlaying({ track }: { track: CurrentTrack }) {
	return (
		<section className="now-playing" aria-label="Now playing">
			<div className="track-art" aria-hidden="true">
				<div className="track-art-sun" />
				<div className="track-art-record">
					<span />
				</div>
				<IconVinyl className="track-art-icon" size={25} stroke={1.2} />
			</div>
			<div className="track-copy">
				<p className="eyebrow">Now playing</p>
				<strong>{track.title}</strong>
				<span>{track.artist}</span>
			</div>
			<span className="track-note">TRACK INFO ONLY</span>
		</section>
	);
}
