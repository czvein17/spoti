import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { RoomDetail, RoomReaction } from "shared";
import {
	joinRoom,
	leaveRoom,
	sendRoomHeartbeat,
	toggleRoomReaction,
} from "../api/room-api";
import { roomQueryKeys } from "../queries/room-query-keys";

export function useRoomJoinMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: {
			roomId: string;
			sessionId: string;
			guestName: string;
		}) => joinRoom(input.roomId, input.sessionId, input.guestName),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() }),
	});
}

export function useRoomLeaveMutation(roomId: string, sessionId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => leaveRoom(roomId, sessionId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() });
			await queryClient.invalidateQueries({
				queryKey: roomQueryKeys.detail(roomId, sessionId),
			});
		},
	});
}

export function useRoomHeartbeat(
	roomId: string,
	sessionId: string,
	enabled: boolean,
) {
	const queryClient = useQueryClient();
	const heartbeat = useMutation({
		mutationFn: () => sendRoomHeartbeat(roomId, sessionId),
		onError: () =>
			queryClient.invalidateQueries({
				queryKey: roomQueryKeys.detail(roomId, sessionId),
			}),
	});

	useEffect(() => {
		if (!enabled) return;

		let sending = false;
		const ping = async () => {
			if (sending) return;
			sending = true;
			try {
				await heartbeat.mutateAsync();
			} catch {
				// The room query reports the expired membership to the guest.
			} finally {
				sending = false;
			}
		};

		void ping();
		const timer = window.setInterval(() => void ping(), 20_000);
		return () => window.clearInterval(timer);
	}, [enabled, heartbeat.mutateAsync]);

	return heartbeat;
}

export function useRoomReactionMutation(roomId: string, sessionId: string) {
	const queryClient = useQueryClient();
	const queryKey = roomQueryKeys.detail(roomId, sessionId);

	return useMutation({
		mutationFn: (emoji: RoomReaction) =>
			toggleRoomReaction(roomId, sessionId, emoji),
		onMutate: async (emoji) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<RoomDetail>(queryKey);
			if (!previous) return { previous };

			const wasActive = previous.myReactions.includes(emoji);
			queryClient.setQueryData<RoomDetail>(queryKey, {
				...previous,
				myReactions: wasActive
					? previous.myReactions.filter((reaction) => reaction !== emoji)
					: [...previous.myReactions, emoji],
				reactionCounts: {
					...previous.reactionCounts,
					[emoji]: Math.max(
						0,
						previous.reactionCounts[emoji] + (wasActive ? -1 : 1),
					),
				},
			});
			return { previous };
		},
		onError: (_error, _emoji, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey }),
	});
}
