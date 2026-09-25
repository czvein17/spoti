import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app-error";
import { toDatabaseAppError } from "../errors/database-error";
import { ValidationError } from "../errors/validation-error";

const INTERNAL_ERROR = {
	code: "internal_error",
	message: "The request could not be completed. Try again.",
} as const;

export const globalErrorHandler: ErrorHandler = (error, c) => {
	const respondWithAppError = (appError: AppError) =>
		c.json(
			{
				error: {
					code: appError.code,
					message: appError.message,
					...(appError instanceof ValidationError
						? { fields: appError.fields }
						: {}),
				},
			},
			appError.statusCode,
		);

	if (error instanceof AppError) return respondWithAppError(error);

	const databaseError = toDatabaseAppError(error);
	if (databaseError) return respondWithAppError(databaseError);

	if (error instanceof HTTPException) {
		return respondWithAppError(
			new AppError({
				statusCode: error.status,
				code:
					error.status === StatusCodes.BAD_REQUEST
						? "invalid_request"
						: "http_error",
				message: error.message,
				cause: error,
			}),
		);
	}

	console.error("Request failed", error);
	return c.json({ error: INTERNAL_ERROR }, StatusCodes.INTERNAL_SERVER_ERROR);
};
