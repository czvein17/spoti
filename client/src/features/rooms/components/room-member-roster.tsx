import { IconHeadphones, IconUser } from "@tabler/icons-react";
import type { RoomMember } from "shared";

export function RoomMemberRoster({ members }: { members: RoomMember[] }) {
	const dj = members.find((member) => member.role === "dj");
	const listeners = members.filter((member) => member.role === "listener");

	return (
		<section className="member-roster" aria-label="People in the room">
			<div className="roster-heading">
				<p className="eyebrow">Around the room</p>
				<span>{members.length} present</span>
			</div>
			<ul className="roster-list">
				{dj ? (
					<li className="roster-member roster-dj" key={dj.id}>
						<span className="roster-avatar roster-avatar-dj">
							<IconHeadphones size={15} stroke={1.7} />
						</span>
						<span className="roster-name">{dj.guestName}</span>
						<span className="roster-role">DJ</span>
					</li>
				) : null}
				{listeners.map((member, index) => (
					<li className="roster-member" key={member.id}>
						<span className={`roster-avatar roster-avatar-${index % 4}`}>
							<IconUser size={15} stroke={1.7} />
						</span>
						<span className="roster-name">{member.guestName}</span>
						{member.reactions.length > 0 ? (
							<span
								className="roster-reactions"
								role="img"
								aria-label="Has reacted"
							>
								{member.reactions
									.map((reaction) =>
										reaction === "heart"
											? "❤️"
											: reaction === "fire"
												? "🔥"
												: "😭",
									)
									.join(" ")}
							</span>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}
