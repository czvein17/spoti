import { queryOptions } from "@tanstack/react-query";
import { getRoom, listRooms } from "../api/room-api";
import { roomQueryKeys } from "./room-query-keys";

export function roomListQueryOptions() {
	return queryOptions({
		queryKey: roomQueryKeys.list(),
		queryFn: listRooms,
		staleTime: 3_000,
	});
}

export function roomDetailQueryOptions(roomId: string, sessionId?: string) {
	return queryOptions({
		queryKey: roomQueryKeys.detail(roomId, sessionId),
		queryFn: () => getRoom(roomId, sessionId),
		staleTime: 2_000,
	});
}
