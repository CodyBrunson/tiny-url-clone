import z from "zod";

const lazyUser: z.ZodLazy<any> = z.lazy(() => User);

export const User = z.object({
	id: z.number().int().nonnegative().optional(),
	username: z.string().min(5, "at least 5 chars").max(50, "at most 50 chars"),
	password: z.string().min(8, "at least 8 chars"),
	email: z.string().email(),
});

export const Login = User.pick({
	username: true,
	password: true,
}).strict();

export const Account = User.pick({
	username: true,
	email: true,
})
	.extend({
		password: z
			.string()
			.min(8, "at least 8 chars")
			.refine(containsNumber, "must contain at least 1 number")
			.refine(containsSpecialChars, "must contain at least 1 character"),
	})
	.strict();

function containsNumber(value: string): boolean {
	return /\d/.test(value);
}

function containsSpecialChars(value: string): boolean {
	return /[!@#$%^&*(),.?":{}|<>]/g.test(value);
}
