import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { RoomMember } from "shared";
import { RoomAvatar } from "./room-avatar";
import { RoomEnvironment } from "./room-environment";
import { isRoomPositionId, ROOM_POSITIONS } from "./room-spots";

function CameraAim() {
	const { camera, size } = useThree();

	useEffect(() => {
		camera.position.set(7.8, 8.7, 10.8);
		camera.lookAt(0, 0.45, -0.15);
		const orthographicCamera = camera as typeof camera & { zoom: number };
		orthographicCamera.zoom = Math.max(36, Math.min(68, size.width / 16));
		camera.updateProjectionMatrix();
	}, [camera, size.width]);

	return null;
}

export function RoomScene({ members }: { members: RoomMember[] }) {
	return (
		<div
			className="room-scene"
			role="img"
			aria-label="A small 3D lounge with a DJ booth and seated listeners"
		>
			<Canvas
				orthographic
				camera={{ position: [7.8, 8.7, 10.8], zoom: 54 }}
				dpr={[1, 1.5]}
				shadows
				gl={{ antialias: true, alpha: true }}
				fallback={
					<p className="scene-fallback">
						This browser cannot display the room scene.
					</p>
				}
			>
				<CameraAim />
				<RoomEnvironment />
				{members.map((member) => {
					if (!isRoomPositionId(member.spotId)) return null;
					return (
						<RoomAvatar
							key={member.id}
							member={member}
							roomPosition={ROOM_POSITIONS[member.spotId]}
						/>
					);
				})}
			</Canvas>
		</div>
	);
}
