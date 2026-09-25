import type { z } from "zod";
import type { ValidatedContext } from "../../middleware/validate-request";
import type {
	guestSessionHeaderSchema,
	joinRoomSchema,
	optionalGuestSessionHeaderSchema,
	roomReactionSchema,
} from "../../schemas/room-schema";

export type GuestSessionContext = ValidatedContext<
	{ header: z.input<typeof guestSessionHeaderSchema> },
	{ header: z.output<typeof guestSessionHeaderSchema> }
>;

export type OptionalGuestSessionContext = ValidatedContext<
	{ header: z.input<typeof optionalGuestSessionHeaderSchema> },
	{ header: z.output<typeof optionalGuestSessionHeaderSchema> }
>;

export type RoomJoinContext = ValidatedContext<
	{
		header: z.input<typeof guestSessionHeaderSchema>;
		json: z.input<typeof joinRoomSchema>;
	},
	{
		header: z.output<typeof guestSessionHeaderSchema>;
		json: z.output<typeof joinRoomSchema>;
	}
>;

export type RoomReactionContext = ValidatedContext<
	{
		header: z.input<typeof guestSessionHeaderSchema>;
		json: z.input<typeof roomReactionSchema>;
	},
	{
		header: z.output<typeof guestSessionHeaderSchema>;
		json: z.output<typeof roomReactionSchema>;
	}
>;
