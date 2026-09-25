import type { RoomReaction } from "shared";

const REACTION_OPTIONS: {
	id: RoomReaction;
	emoji: string;
	label: string;
}[] = [
	{ id: "heart", emoji: "❤️", label: "Love it" },
	{ id: "fire", emoji: "🔥", label: "On fire" },
	{ id: "cry", emoji: "😭", label: "Hit me in the feels" },
];

type ReactionBarProps = {
	counts: Record<RoomReaction, number>;
	selected: RoomReaction[];
	disabled?: boolean;
	onReact: (reaction: RoomReaction) => void;
};

export function ReactionBar({
	counts,
	selected,
	disabled = false,
	onReact,
}: ReactionBarProps) {
	return (
		<div className="reaction-panel">
			<div className="reaction-heading">
				<p className="eyebrow">Feel the room</p>
				<span>Tap to react</span>
			</div>
			<div className="reaction-list">
				{REACTION_OPTIONS.map((reaction) => {
					const active = selected.includes(reaction.id);
					return (
						<button
							className={`reaction-button${active ? " is-active" : ""}`}
							key={reaction.id}
							type="button"
							aria-label={`${reaction.label}, ${counts[reaction.id]} reactions`}
							aria-pressed={active}
							disabled={disabled}
							onClick={() => onReact(reaction.id)}
						>
							<span className="reaction-emoji" aria-hidden="true">
								{reaction.emoji}
							</span>
							<span className="reaction-count">{counts[reaction.id]}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
