import { describe, expect, it } from "bun:test";
import { StatusCodes } from "http-status-codes";
import { formatValidationFields, ValidationError } from "./validation-error";

describe("validation errors", () => {
	it("formats nested paths and uses the first message for each field", () => {
		expect(
			formatValidationFields([
				{ path: ["room", "name"], message: "Enter a name." },
				{ path: ["room", "name"], message: "Name is too long." },
				{ path: [], message: "Invalid request." },
			]),
		).toEqual({
			"room.name": "Enter a name.",
			form: "Enter valid request details.",
		});
	});

	it("supports the schema-specific public code and message", () => {
		const error = ValidationError.fromIssues(
			[{ path: ["guestName"], message: "Required." }],
			{ code: "invalid_input", message: "Enter a display name." },
		);

		expect(error).toMatchObject({
			statusCode: StatusCodes.BAD_REQUEST,
			code: "invalid_input",
			message: "Enter a display name.",
			fields: { guestName: "Required." },
		});
	});
});
