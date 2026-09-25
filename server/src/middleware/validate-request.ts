import { zValidator } from "@hono/zod-validator";
import type { Context, Env, ValidationTargets } from "hono";
import type { ZodSchema } from "zod";
import { ValidationError } from "../errors/validation-error";

export type ValidatedContext<
	Input extends object,
	Output extends object,
> = Context<Env, string, { in: Input; out: Output }>;

export const validateRequest = <
	Schema extends ZodSchema,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: Schema,
) =>
	zValidator(target, schema, (result) => {
		if (result.success) return;

		const metadata = schema.meta();
		const code =
			typeof metadata?.apiErrorCode === "string"
				? metadata.apiErrorCode
				: "invalid_request";
		const message =
			typeof metadata?.apiErrorMessage === "string"
				? metadata.apiErrorMessage
				: (result.error.issues[0]?.message ?? "Request validation failed.");

		throw ValidationError.fromIssues(result.error.issues, { code, message });
	});
