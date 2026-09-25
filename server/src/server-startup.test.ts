import { describe, expect, it } from "bun:test";
import { startServer } from "./server-startup";

describe("server startup", () => {
	it("waits for the database check before starting the listener", async () => {
		const startupSteps: string[] = [];

		await startServer(
			async () => {
				await Promise.resolve();
				startupSteps.push("database");
			},
			() => {
				startupSteps.push("listener");
			},
		);

		expect(startupSteps).toEqual(["database", "listener"]);
	});

	it("does not start the listener when the database check fails", async () => {
		const failure = new Error("database unavailable");
		let listenerStarted = false;
		let caughtError: unknown;

		try {
			await startServer(
				async () => {
					throw failure;
				},
				() => {
					listenerStarted = true;
				},
			);
		} catch (error) {
			caughtError = error;
		}

		expect(caughtError).toBe(failure);
		expect(listenerStarted).toBe(false);
	});
});
