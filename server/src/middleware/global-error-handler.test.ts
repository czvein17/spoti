import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app-error";
import {
	isDatabaseUniqueViolation,
	toDatabaseAppError,
} from "../errors/database-error";
import { ValidationError } from "../errors/validation-error";
import { globalErrorHandler } from "./global-error-handler";

function appThatThrows(error: unknown) {
	return new Hono().onError(globalErrorHandler).get("/", () => {
		throw error;
	});
}

describe("global API error handler", () => {
	it("maps PostgreSQL unique violations to a generic conflict", async () => {
		const error = Object.assign(new Error("private database detail"), {
			code: "23505",
			detail: "private database detail",
			constraint_name: "room_member_spot_unique",
		});
		const response = await appThatThrows(error).request("/");
		const body = await response.text();

		expect(response.status).toBe(StatusCodes.CONFLICT);
		expect(isDatabaseUniqueViolation(error)).toBe(true);
		expect(JSON.parse(body)).toEqual({
			error: {
				code: "duplicate_record",
				message: "A record with these details already exists.",
			},
		});
		expect(body).not.toContain("private database detail");
	});

	const mappedDatabaseErrors = [
		{
			sqlState: "23503",
			statusCode: StatusCodes.CONFLICT,
			code: "resource_relation_conflict",
			message: "The resource cannot be changed because it is still in use.",
		},
		{
			sqlState: "22P02",
			statusCode: StatusCodes.BAD_REQUEST,
			code: "invalid_data",
			message: "The request contains invalid data.",
		},
		{
			sqlState: "23514",
			statusCode: StatusCodes.BAD_REQUEST,
			code: "invalid_data",
			message: "The request violates a data constraint.",
		},
		{
			sqlState: "40001",
			statusCode: StatusCodes.SERVICE_UNAVAILABLE,
			code: "database_retry",
			message: "The database is temporarily unavailable.",
		},
		{
			sqlState: "40P01",
			statusCode: StatusCodes.SERVICE_UNAVAILABLE,
			code: "database_retry",
			message: "The database is temporarily unavailable.",
		},
	] as const;

	for (const expected of mappedDatabaseErrors) {
		it(`maps PostgreSQL SQLSTATE ${expected.sqlState}`, async () => {
			const databaseError = Object.assign(
				new Error("private database detail"),
				{
					code: expected.sqlState,
				},
			);
			const error = new Error("database wrapper", {
				cause: new Error("driver wrapper", { cause: databaseError }),
			});
			const response = await appThatThrows(error).request("/");

			expect(response.status).toBe(expected.statusCode);
			expect(await response.json()).toEqual({
				error: { code: expected.code, message: expected.message },
			});
			expect(toDatabaseAppError(error)?.cause).toBe(error);
		});
	}

	it("maps HTTP exceptions into the API error envelope", async () => {
		const response = await appThatThrows(
			new HTTPException(StatusCodes.BAD_REQUEST, {
				message: "Malformed JSON in request body",
			}),
		).request("/");

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toEqual({
			error: {
				code: "invalid_request",
				message: "Malformed JSON in request body",
			},
		});
	});

	it("maps expected AppErrors into the API error envelope", async () => {
		const response = await appThatThrows(
			new AppError({
				code: "room_closed",
				message: "This room is closed.",
				statusCode: StatusCodes.CONFLICT,
			}),
		).request("/");

		expect(response.status).toBe(StatusCodes.CONFLICT);
		expect(await response.json()).toEqual({
			error: { code: "room_closed", message: "This room is closed." },
		});
	});

	it("includes field errors for validation AppErrors", async () => {
		const response = await appThatThrows(
			new ValidationError(
				{ guestName: "Enter a display name." },
				{ code: "invalid_input", message: "Enter a display name." },
			),
		).request("/");

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(await response.json()).toEqual({
			error: {
				code: "invalid_input",
				message: "Enter a display name.",
				fields: { guestName: "Enter a display name." },
			},
		});
	});

	it("logs unknown errors and returns a generic response", async () => {
		const response = await appThatThrows(
			new Error("sensitive database detail"),
		).request("/");

		expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(await response.json()).toEqual({
			error: {
				code: "internal_error",
				message: "The request could not be completed. Try again.",
			},
		});
	});
});
