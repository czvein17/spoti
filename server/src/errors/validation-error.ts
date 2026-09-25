import { StatusCodes } from "http-status-codes";
import { AppError } from "./app-error";

export type ValidationIssue = {
	path: PropertyKey[];
	message: string;
};

type ValidationErrorOptions = {
	code?: string;
	message?: string;
};

export function formatValidationFields(issues: readonly ValidationIssue[]) {
	const fields = new Map<string, string>();

	for (const { path, message } of issues) {
		const field = path.map(String).join(".") || "form";
		if (fields.has(field)) continue;

		fields.set(field, path.length ? message : "Enter valid request details.");
	}

	return Object.fromEntries(fields);
}

export class ValidationError extends AppError {
	readonly fields: Record<string, string>;

	constructor(
		fields: Record<string, string>,
		options: ValidationErrorOptions = {},
	) {
		super({
			statusCode: StatusCodes.BAD_REQUEST,
			code: options.code ?? "validation_error",
			message: options.message ?? "Please fix the highlighted fields.",
		});
		this.name = "ValidationError";
		this.fields = fields;
	}

	static fromIssues(
		issues: readonly ValidationIssue[],
		options?: ValidationErrorOptions,
	) {
		return new ValidationError(formatValidationFields(issues), options);
	}
}
