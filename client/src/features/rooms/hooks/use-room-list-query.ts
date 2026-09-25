import { useQuery } from "@tanstack/react-query";
import { roomListQueryOptions } from "../queries/room-query-options";

export function useRoomListQuery() {
	return useQuery(roomListQueryOptions());
}
