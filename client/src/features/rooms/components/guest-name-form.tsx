import { IconArrowRight, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type GuestNameFormProps = {
	roomName: string;
	initialName?: string;
	busy?: boolean;
	error?: string | null;
	onSubmit: (guestName: string) => void;
	onCancel?: () => void;
};

export function GuestNameForm({
	roomName,
	initialName = "",
	busy = false,
	error,
	onSubmit,
	onCancel,
}: GuestNameFormProps) {
	const [guestName, setGuestName] = useState(initialName);
	const nameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		nameInputRef.current?.focus();
	}, []);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const cleanName = guestName.trim();
		if (!cleanName) return;
		onSubmit(cleanName);
	}

	return (
		<form className="guest-name-form" onSubmit={submit}>
			<div className="form-heading-row">
				<div>
					<p className="eyebrow">Your place at the table</p>
					<h2 id="guest-form-title">What should we call you?</h2>
				</div>
				{onCancel ? (
					<button
						className="icon-button form-close"
						type="button"
						aria-label="Close guest name form"
						onClick={onCancel}
					>
						<IconX size={18} stroke={1.7} />
					</button>
				) : null}
			</div>

			<p className="form-description">
				Choose a name for this visit. No account needed to step into {roomName}.
			</p>

			<label className="field-label" htmlFor="guest-name">
				Display name
			</label>
			<input
				id="guest-name"
				ref={nameInputRef}
				className="text-field"
				value={guestName}
				maxLength={24}
				autoComplete="nickname"
				placeholder="e.g. midnightfox"
				onChange={(event) => setGuestName(event.target.value)}
				required
			/>
			<div className="field-meta">
				<span>Up to 24 characters</span>
				<span>{guestName.trim().length}/24</span>
			</div>

			{error ? (
				<p className="form-error" role="alert">
					{error}
				</p>
			) : null}

			<button
				className="primary-button form-submit"
				type="submit"
				disabled={busy || !guestName.trim()}
			>
				{busy ? "Finding you a seat…" : "Join the room"}
				<IconArrowRight size={18} stroke={1.7} aria-hidden="true" />
			</button>
			<p className="form-footnote">
				Your guest name stays in this browser tab.
			</p>
		</form>
	);
}
