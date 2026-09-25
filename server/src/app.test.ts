import { describe, expect, it } from "bun:test";
import { StatusCodes } from "http-status-codes";
import { app } from "./app";

describe("Hono app composition", () => {
	it("serves the root greeting", async () => {
		const response = await app.request("/");

		expect(response.status).toBe(StatusCodes.OK);
		expect(await response.text()).toBe("Hello Hono!");
	});

	it("serves the typed hello response", async () => {
		const response = await app.request("/hello");

		expect(response.status).toBe(StatusCodes.OK);
		expect(await response.json()).toEqual({
			message: "Hello BHVR!",
			success: true,
		});
	});

	it("mounts room routes and applies the app error handler", async () => {
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
				fields: { "x-guest-session-id": expect.any(String) },
			},
		});
	});
});
