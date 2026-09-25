import type { ContentfulStatusCode } from "hono/utils/http-status";

type AppErrorInput = {
	statusCode: ContentfulStatusCode;
	code: string;
	message: string;
	cause?: unknown;
};

export class AppError extends Error {
	readonly statusCode: ContentfulStatusCode;
	readonly code: string;

	constructor(input: AppErrorInput) {
		super(input.message, { cause: input.cause });
		this.name = "AppError";
		this.statusCode = input.statusCode;
		this.code = input.code;
	}
}
