import { describe, expect, it } from "bun:test";
import { StatusCodes } from "http-status-codes";
import { app } from "./app";

describe("Hono app composition", () => {
	it("serves the typed hello response with secure headers", async () => {
		const response = await app.request("/hello");

		expect(response.status).toBe(StatusCodes.OK);
		expect(await response.json()).toEqual({
			message: "Hello BHVR!",
			success: true,
		});
		expect(response.headers.get("x-content-type-options")).toBe("nosniff");
		expect(response.headers.get("x-frame-options")).toBeTruthy();
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
