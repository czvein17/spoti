export const roomQueryKeys = {
	all: ["rooms"] as const,
	list: () => ["rooms", "list"] as const,
	detail: (roomId: string, sessionId?: string) =>
		["rooms", "detail", roomId, sessionId ?? null] as const,
};
