import { describe, expect, it } from "bun:test";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import { app } from "../index";

describe("room route validation", () => {
	it("lets valid guest join requests reach the room service", async () => {
		const response = await app.request(
			"/api/v1/rooms/room-that-does-not-exist/join",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-guest-session-id": randomUUID(),
				},
				body: JSON.stringify({ guestName: "Mika" }),
			},
		);

		expect(response.status).toBe(StatusCodes.NOT_FOUND);
		expect(await response.json()).toMatchObject({
			error: { code: "room_not_found" },
		});
	});

	it("returns the custom error for an invalid guest session header", async () => {
		const response = await app.request(
			"/api/v1/rooms/room-that-does-not-exist/join",
			{
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ guestName: "Mika" }),
			},
		);

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toMatchObject({
			error: {
				code: "invalid_session",
				message: "Return to the room list and join again.",
				fields: {
					"x-guest-session-id": expect.any(String),
				},
			},
		});
	});

	it("returns the custom error for an invalid display name", async () => {
		const response = await app.request(
			"/api/v1/rooms/room-that-does-not-exist/join",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-guest-session-id": randomUUID(),
				},
				body: JSON.stringify({ guestName: "  " }),
			},
		);

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toMatchObject({
			error: {
				code: "invalid_input",
				message: "Enter a display name with up to 24 characters.",
				fields: { guestName: expect.any(String) },
			},
		});
	});

	it("returns the custom error for an unsupported reaction", async () => {
		const response = await app.request(
			"/api/v1/rooms/room-that-does-not-exist/reactions",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-guest-session-id": randomUUID(),
				},
				body: JSON.stringify({ emoji: "thumbs-up" }),
			},
		);

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toMatchObject({
			error: {
				code: "invalid_reaction",
				message: "Choose one of the room reactions.",
			},
		});
	});

	it("returns a structured error for malformed JSON", async () => {
		const response = await app.request(
			"/api/v1/rooms/room-that-does-not-exist/join",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-guest-session-id": randomUUID(),
				},
				body: "{",
			},
		);

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toMatchObject({
			error: { code: "invalid_request" },
		});
	});
});
