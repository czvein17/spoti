import { useQuery } from "@tanstack/react-query";
import { roomDetailQueryOptions } from "../queries/room-query-options";

export function useRoomQuery(roomId: string, sessionId?: string) {
	return useQuery({
		...roomDetailQueryOptions(roomId, sessionId),
		refetchInterval: 5_000,
		refetchIntervalInBackground: false,
	});
}
