import { ROOM_REACTIONS } from "shared";
import { z } from "zod";

export const joinRoomSchema = z
	.object({
		guestName: z.string().trim().min(1).max(24),
	})
	.meta({
		apiErrorCode: "invalid_input",
		apiErrorMessage: "Enter a display name with up to 24 characters.",
	});

export const roomReactionSchema = z
	.object({
		emoji: z.enum(ROOM_REACTIONS),
	})
	.meta({
		apiErrorCode: "invalid_reaction",
		apiErrorMessage: "Choose one of the room reactions.",
	});

export const guestSessionIdSchema = z.string().uuid();

export const guestSessionHeaderSchema = z
	.object({
		"x-guest-session-id": guestSessionIdSchema,
	})
	.meta({
		apiErrorCode: "invalid_session",
		apiErrorMessage: "Return to the room list and join again.",
	});

export const optionalGuestSessionHeaderSchema = z
	.object({
		"x-guest-session-id": guestSessionIdSchema.optional(),
	})
	.meta({
		apiErrorCode: "invalid_session",
		apiErrorMessage: "Return to the room list and join again.",
	});
