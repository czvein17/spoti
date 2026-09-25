import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { RoomMember } from "shared";
import type { RoomPosition } from "./room-spots";

const LISTENER_COLORS = ["#78988F", "#C47D50", "#8B9CA0", "#B4A078", "#927D88"];

function colorForName(name: string) {
	const sum = [...name].reduce(
		(value, character) => value + character.charCodeAt(0),
		0,
	);
	return LISTENER_COLORS[sum % LISTENER_COLORS.length] ?? LISTENER_COLORS[0];
}

export function RoomAvatar({
	member,
	roomPosition,
}: {
	member: RoomMember;
	roomPosition: RoomPosition;
}) {
	const group = useRef<Group>(null);
	const color = useMemo(
		() => (member.role === "dj" ? "#C47D50" : colorForName(member.guestName)),
		[member.guestName, member.role],
	);
	const bobOffset = member.id.charCodeAt(0) * 0.17;

	useFrame(({ clock }) => {
		if (!group.current) return;
		group.current.position.y =
			roomPosition.position[1] +
			Math.sin(clock.elapsedTime * 1.25 + bobOffset) * 0.035;
	});

	return (
		<group
			ref={group}
			position={roomPosition.position}
			rotation={[0, roomPosition.yaw, 0]}
		>
			{member.reactions.length > 0 ? (
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
					<ringGeometry args={[0.47, 0.51, 32]} />
					<meshBasicMaterial color="#C47D50" transparent opacity={0.85} />
				</mesh>
			) : null}

			<mesh position={[0, 0.54, 0]} castShadow>
				<cylinderGeometry args={[0.2, 0.29, 0.78, 7]} />
				<meshStandardMaterial color={color} roughness={0.74} />
			</mesh>
			<mesh position={[0, 1.11, 0]} castShadow>
				<sphereGeometry args={[0.25, 16, 14]} />
				<meshStandardMaterial color="#D7B9A0" roughness={0.86} />
			</mesh>
			<mesh position={[0, 1.27, -0.025]} castShadow>
				<sphereGeometry args={[0.255, 12, 8]} />
				<meshStandardMaterial
					color={member.role === "dj" ? "#23272B" : "#333238"}
					roughness={0.95}
				/>
			</mesh>
			{[-1, 1].map((side) => (
				<mesh
					key={side}
					position={[side * 0.31, 0.55, 0]}
					rotation={[0, 0, side * -0.12]}
					castShadow
				>
					<cylinderGeometry args={[0.075, 0.09, 0.63, 7]} />
					<meshStandardMaterial color={color} roughness={0.8} />
				</mesh>
			))}
			{[-1, 1].map((side) => (
				<mesh key={side} position={[side * 0.115, 0.13, 0.015]} castShadow>
					<cylinderGeometry args={[0.085, 0.11, 0.26, 7]} />
					<meshStandardMaterial color="#30333A" roughness={0.9} />
				</mesh>
			))}
			{member.role === "dj" ? (
				<group position={[0, 1.12, 0]}>
					<mesh position={[0, 0.2, 0]}>
						<torusGeometry args={[0.31, 0.045, 7, 18, Math.PI]} />
						<meshStandardMaterial color="#202329" roughness={0.5} />
					</mesh>
					<mesh position={[-0.29, 0.08, 0]}>
						<sphereGeometry args={[0.09, 10, 8]} />
						<meshStandardMaterial color="#C47D50" roughness={0.6} />
					</mesh>
					<mesh position={[0.29, 0.08, 0]}>
						<sphereGeometry args={[0.09, 10, 8]} />
						<meshStandardMaterial color="#C47D50" roughness={0.6} />
					</mesh>
				</group>
			) : null}
		</group>
	);
}
