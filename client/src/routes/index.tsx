import { useEffect, useRef, useState } from "react";
import {
	IconArrowDownRight,
	IconDisc,
	IconMoonStars,
} from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GuestNameForm } from "@features/rooms/components/guest-name-form";
import { RoomCard } from "@features/rooms/components/room-card";
import { useRoomJoinMutation } from "@features/rooms/hooks/use-room-mutations";
import { useRoomListQuery } from "@features/rooms/hooks/use-room-list-query";
import { createGuestSession } from "@features/rooms/services/guest-session";

export const Route = createFileRoute("/")({ component: RoomDiscovery });

function RoomDiscovery() {
	const roomsQuery = useRoomListQuery();
	const joinMutation = useRoomJoinMutation();
	const navigate = useNavigate();
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const selectedRoom = roomsQuery.data?.find(
		(room) => room.id === selectedRoomId,
	);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (selectedRoom && dialog && !dialog.open) dialog.showModal();
	}, [selectedRoom]);

	function joinSelectedRoom(guestName: string) {
		if (!selectedRoom) return;
		const session = createGuestSession(guestName);
		joinMutation.mutate(
			{
				roomId: selectedRoom.id,
				sessionId: session.id,
				guestName: session.guestName,
			},
			{
				onSuccess: () =>
					navigate({
						to: "/rooms/$roomId",
						params: { roomId: selectedRoom.id },
					}),
			},
		);
	}

	return (
		<main className="discovery-page">
			<div className="page-grain" aria-hidden="true" />
			<header className="site-header">
				<Link to="/" className="brand-lockup" aria-label="Afterhours home">
					<span className="brand-mark">
						<IconDisc size={23} stroke={1.4} />
					</span>
					<span className="brand-name">AFTERHOURS</span>
				</Link>
				<div className="header-note">
					<IconMoonStars size={16} stroke={1.5} aria-hidden="true" />
					<span>A little company for the late hours</span>
				</div>
				<span className="header-time">LISTEN TOGETHER</span>
			</header>

			<section className="discovery-hero">
				<div className="hero-copy">
					<p className="eyebrow hero-eyebrow">A listening room for right now</p>
					<h1>
						Good music sounds better <em>in good company.</em>
					</h1>
					<p className="hero-description">
						Come in for a track. Stay for the feeling of everyone being here at
						once.
					</p>
					<a href="#rooms" className="text-link">
						Find your room
						<IconArrowDownRight size={18} stroke={1.6} aria-hidden="true" />
					</a>
				</div>
				<div className="hero-orbit" aria-hidden="true">
					<div className="hero-orbit-ring hero-orbit-ring-one" />
					<div className="hero-orbit-ring hero-orbit-ring-two" />
					<div className="hero-orbit-disc">
						<span />
					</div>
					<div className="hero-orbit-label">SIDE A / TOGETHER</div>
					<div className="hero-orbit-spark hero-orbit-spark-one" />
					<div className="hero-orbit-spark hero-orbit-spark-two" />
				</div>
			</section>

			<section className="room-discovery-section" id="rooms">
				<div className="section-heading">
					<div>
						<p className="eyebrow">The room is open</p>
						<h2>Drop by tonight</h2>
					</div>
					<span className="section-index">01 ROOM AVAILABLE</span>
				</div>

				{roomsQuery.isPending ? (
					<div className="room-list-state" role="status">
						Warming up the room…
					</div>
				) : roomsQuery.isError ? (
					<div className="room-list-state room-list-error" role="alert">
						<p>The room list couldn’t load.</p>
						<button
							className="text-button"
							type="button"
							onClick={() => roomsQuery.refetch()}
						>
							Try again
						</button>
					</div>
				) : roomsQuery.data?.length ? (
					<div className="room-list">
						{roomsQuery.data.map((room) => (
							<RoomCard
								key={room.id}
								room={room}
								onJoin={() => {
									joinMutation.reset();
									setSelectedRoomId(room.id);
								}}
							/>
						))}
					</div>
				) : (
					<div className="room-list-state">
						No rooms are open yet. Check back soon.
					</div>
				)}
			</section>

			<footer className="discovery-footer">
				<span>Made for listening, together.</span>
				<span>TRACK DETAILS ONLY · NO AUDIO STREAM</span>
			</footer>

			{selectedRoom ? (
				<dialog
					ref={dialogRef}
					className="join-dialog"
					aria-labelledby="guest-form-title"
					onCancel={() => setSelectedRoomId(null)}
					onClose={() => setSelectedRoomId(null)}
				>
					<GuestNameForm
						roomName={selectedRoom.name}
						busy={joinMutation.isPending}
						error={joinMutation.error?.message}
						onSubmit={joinSelectedRoom}
						onCancel={() => setSelectedRoomId(null)}
					/>
				</dialog>
			) : null}
		</main>
	);
}
