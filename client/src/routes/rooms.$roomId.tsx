import { IconArrowLeft, IconDisc, IconInfoCircle } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GuestNameForm } from "@features/rooms/components/guest-name-form";
import { NowPlaying } from "@features/rooms/components/now-playing";
import { ReactionBar } from "@features/rooms/components/reaction-bar";
import { RoomHud } from "@features/rooms/components/room-hud";
import { RoomMemberRoster } from "@features/rooms/components/room-member-roster";
import {
	useRoomHeartbeat,
	useRoomJoinMutation,
	useRoomLeaveMutation,
	useRoomReactionMutation,
} from "@features/rooms/hooks/use-room-mutations";
import { useRoomQuery } from "@features/rooms/hooks/use-room-query";
import { roomQueryKeys } from "@features/rooms/queries/room-query-keys";
import {
	clearGuestSession,
	createGuestSession,
	readGuestSession,
	type GuestSession,
} from "@features/rooms/services/guest-session";
import { RoomScene } from "@features/rooms/three/room-scene";
import { useQueryClient } from "@tanstack/react-query";
import type { RoomDetail } from "shared";

export const Route = createFileRoute("/rooms/$roomId")({
	component: RoomExperience,
});

function RoomExperience() {
	const { roomId } = Route.useParams();
	const [guestSession, setGuestSession] = useState<GuestSession | null>(
		readGuestSession,
	);
	const roomQuery = useRoomQuery(roomId, guestSession?.id);
	const joinMutation = useRoomJoinMutation();
	const queryClient = useQueryClient();
	const room = roomQuery.data;

	function joinAsGuest(guestName: string) {
		if (!room) return;
		const session = createGuestSession(guestName);
		setGuestSession(session);
		joinMutation.mutate(
			{ roomId, sessionId: session.id, guestName: session.guestName },
			{
				onSuccess: () =>
					queryClient.invalidateQueries({
						queryKey: roomQueryKeys.detail(roomId, session.id),
					}),
			},
		);
	}

	return (
		<main className="room-page">
			<div className="page-grain" aria-hidden="true" />
			<header className="site-header room-site-header">
				<Link to="/" className="brand-lockup" aria-label="Back to room list">
					<span className="brand-mark">
						<IconDisc size={23} stroke={1.4} />
					</span>
					<span className="brand-name">AFTERHOURS</span>
				</Link>
				<div className="header-note">
					<span className="room-open-dot" />
					<span>YOUR NIGHT, YOUR PACE</span>
				</div>
				<span className="header-time">GUEST SESSION</span>
			</header>

			{roomQuery.isPending ? (
				<div className="room-page-state" role="status">
					Opening the lounge…
				</div>
			) : roomQuery.isError ? (
				<section className="room-page-state room-error-state" role="alert">
					<p className="eyebrow">The door is closed</p>
					<h1>{roomQuery.error.message}</h1>
					<Link to="/" className="primary-button">
						Back to rooms
					</Link>
				</section>
			) : room ? (
				room.isMember && guestSession ? (
					<ActiveRoom room={room} sessionId={guestSession.id} />
				) : (
					<RoomEntry
						room={room}
						initialName={guestSession?.guestName}
						busy={joinMutation.isPending}
						error={joinMutation.error?.message}
						onJoin={joinAsGuest}
					/>
				)
			) : null}
		</main>
	);
}

function RoomEntry({
	room,
	initialName,
	busy,
	error,
	onJoin,
}: {
	room: RoomDetail;
	initialName?: string;
	busy: boolean;
	error?: string;
	onJoin: (name: string) => void;
}) {
	return (
		<section className="room-entry-layout">
			<div className="entry-scene-panel">
				<RoomScene members={room.members} />
				<div className="entry-scene-wash" />
				<RoomHud room={room} />
				<div className="entry-scene-caption">
					<span className="room-open-dot" />
					<span>{room.memberCount} people are already listening</span>
				</div>
			</div>
			<div className="entry-card-wrap">
				<GuestNameForm
					roomName={room.name}
					initialName={initialName}
					busy={busy}
					error={error}
					onSubmit={onJoin}
				/>
				<p className="entry-seat-note">
					<IconInfoCircle size={15} stroke={1.6} />A seat is held only while
					you’re here.
				</p>
			</div>
		</section>
	);
}

function ActiveRoom({
	room,
	sessionId,
}: {
	room: RoomDetail;
	sessionId: string;
}) {
	const navigate = useNavigate();
	const leaveMutation = useRoomLeaveMutation(room.id, sessionId);
	const reactionMutation = useRoomReactionMutation(room.id, sessionId);
	const [leaveError, setLeaveError] = useState<string | null>(null);
	useRoomHeartbeat(room.id, sessionId, true);

	async function leave() {
		setLeaveError(null);
		try {
			await leaveMutation.mutateAsync();
			clearGuestSession();
			await navigate({ to: "/" });
		} catch (error) {
			setLeaveError(
				error instanceof Error
					? error.message
					: "You couldn’t leave the room yet.",
			);
		}
	}

	return (
		<section className="active-room-content">
			<div className="active-room-heading">
				<div>
					<p className="eyebrow">You found your seat</p>
					<h1>{room.name}</h1>
				</div>
				<button
					className="leave-button"
					type="button"
					disabled={leaveMutation.isPending}
					onClick={() => void leave()}
				>
					<IconArrowLeft size={16} stroke={1.7} aria-hidden="true" />
					{leaveMutation.isPending ? "Leaving…" : "Leave room"}
				</button>
			</div>

			<div className="room-stage">
				<RoomScene members={room.members} />
				<div className="room-stage-vignette" aria-hidden="true" />
				<RoomHud room={room} />
				<div className="stage-corner-mark" aria-hidden="true">
					AFTERHOURS / 001
				</div>
				<NowPlaying track={room.currentTrack} />
			</div>

			<div className="room-social-row">
				<RoomMemberRoster members={room.members} />
				<ReactionBar
					counts={room.reactionCounts}
					selected={room.myReactions}
					disabled={reactionMutation.isPending}
					onReact={(reaction) => reactionMutation.mutate(reaction)}
				/>
			</div>

			<div className="room-footer-note">
				{leaveError || reactionMutation.error?.message ? (
					<p role="alert">{leaveError ?? reactionMutation.error?.message}</p>
				) : (
					<span>Track details only · no audio stream</span>
				)}
				<span className="room-refresh-note">
					Room updates every few seconds
				</span>
			</div>
		</section>
	);
}
