function AcousticPanel({ x, height = 1.6 }: { x: number; height?: number }) {
	return (
		<mesh position={[x, 1.62, -3.82]} castShadow>
			<boxGeometry args={[0.55, height, 0.12]} />
			<meshStandardMaterial color="#2B2E31" roughness={0.92} />
		</mesh>
	);
}

function Booth() {
	return (
		<group position={[0, 0, -2.52]}>
			<mesh position={[0, 0.45, 0]} castShadow receiveShadow>
				<boxGeometry args={[2.65, 0.9, 0.62]} />
				<meshStandardMaterial color="#38302B" roughness={0.7} />
			</mesh>
			<mesh position={[0, 0.47, 0.324]}>
				<boxGeometry args={[2.45, 0.53, 0.025]} />
				<meshStandardMaterial color="#17191C" roughness={0.45} />
			</mesh>
			<mesh position={[0, 0.77, 0.345]}>
				<boxGeometry args={[0.52, 0.08, 0.035]} />
				<meshStandardMaterial
					color="#C47D50"
					emissive="#733D24"
					emissiveIntensity={0.6}
				/>
			</mesh>
			{[-0.78, 0.78].map((x) => (
				<group key={x} position={[x, 0.94, -0.05]}>
					<mesh rotation={[-Math.PI / 2, 0, 0]}>
						<cylinderGeometry args={[0.36, 0.36, 0.08, 28]} />
						<meshStandardMaterial color="#15171A" roughness={0.48} />
					</mesh>
					<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
						<cylinderGeometry args={[0.19, 0.19, 0.03, 24]} />
						<meshStandardMaterial color="#78988F" roughness={0.42} />
					</mesh>
				</group>
			))}
			<mesh position={[0, 1.03, -0.02]}>
				<boxGeometry args={[0.018, 0.18, 0.08]} />
				<meshStandardMaterial
					color="#C47D50"
					emissive="#C47D50"
					emissiveIntensity={0.7}
				/>
			</mesh>
		</group>
	);
}

function LoungeSeat({
	position,
	rotation = 0,
}: {
	position: [number, number, number];
	rotation?: number;
}) {
	return (
		<group position={position} rotation={[0, rotation, 0]}>
			<mesh position={[0, 0.25, 0]} castShadow>
				<boxGeometry args={[1.45, 0.42, 0.74]} />
				<meshStandardMaterial color="#454442" roughness={0.98} />
			</mesh>
			<mesh position={[0, 0.58, -0.22]} castShadow>
				<boxGeometry args={[1.45, 0.46, 0.28]} />
				<meshStandardMaterial color="#383938" roughness={0.96} />
			</mesh>
			{[-0.54, 0.54].map((x) => (
				<mesh key={x} position={[x, 0.09, 0]} castShadow>
					<boxGeometry args={[0.09, 0.2, 0.1]} />
					<meshStandardMaterial color="#27292A" roughness={0.9} />
				</mesh>
			))}
		</group>
	);
}

export function RoomEnvironment() {
	return (
		<group>
			<mesh position={[0, -0.2, 0]} receiveShadow>
				<boxGeometry args={[9.2, 0.38, 8.1]} />
				<meshStandardMaterial color="#202329" roughness={0.9} />
			</mesh>
			<mesh position={[0, -0.4, 0]}>
				<boxGeometry args={[9.45, 0.08, 8.34]} />
				<meshStandardMaterial color="#C47D50" roughness={0.55} />
			</mesh>
			<mesh position={[0, 1.45, -4.05]} receiveShadow>
				<boxGeometry args={[9.2, 3.4, 0.25]} />
				<meshStandardMaterial color="#191C20" roughness={0.93} />
			</mesh>
			<mesh position={[-4.58, 1.4, -0.08]} receiveShadow>
				<boxGeometry args={[0.18, 3.3, 7.9]} />
				<meshStandardMaterial color="#171A1E" roughness={0.95} />
			</mesh>
			<mesh position={[4.58, 1.4, -0.08]} receiveShadow>
				<boxGeometry args={[0.18, 3.3, 7.9]} />
				<meshStandardMaterial color="#171A1E" roughness={0.95} />
			</mesh>
			{[-3.5, -2.3, -1.15, 1.15, 2.3, 3.5].map((x) => (
				<AcousticPanel
					key={x}
					x={x}
					height={x === 1.15 || x === -1.15 ? 1.15 : 1.75}
				/>
			))}
			<mesh position={[0, 2.82, -3.88]}>
				<boxGeometry args={[1.3, 0.045, 0.06]} />
				<meshStandardMaterial
					color="#78988F"
					emissive="#41645D"
					emissiveIntensity={0.35}
				/>
			</mesh>
			<Booth />
			<LoungeSeat position={[-2.7, 0, 0.35]} rotation={0.22} />
			<LoungeSeat position={[2.7, 0, 0.35]} rotation={-0.22} />
			<mesh position={[0, -0.005, 1.55]} rotation={[-Math.PI / 2, 0, 0]}>
				<cylinderGeometry args={[1.3, 1.3, 0.018, 48]} />
				<meshStandardMaterial color="#2A302F" roughness={0.95} />
			</mesh>
			<ambientLight intensity={1.15} color="#D5D0C5" />
			<directionalLight
				position={[1, 8, 5]}
				intensity={1.5}
				color="#D2C8B8"
				castShadow
			/>
			<pointLight
				position={[0, 4.6, -2.1]}
				intensity={13}
				distance={8}
				color="#C47D50"
			/>
			<pointLight
				position={[-3.5, 2.4, 0.6]}
				intensity={5}
				distance={6}
				color="#78988F"
			/>
		</group>
	);
}
