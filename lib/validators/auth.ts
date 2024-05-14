import { z } from "zod";

export const SigninValidator = z.object({
    email: z.string().email({
        message: "Email is invalid"
    }),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters long"
    })
});

export const VerifyEmailValidator = z.object({
    userId: z.string(),
    token: z.string()
});

export const ResendTokenValidator = z.object({
    userId: z.string()
});

export const GetUserEmailValidator = z.object({
    userId: z.string()
});

export type SigninPayload = z.infer<typeof SigninValidator>;
export type VerifyEmailPayload = z.infer<typeof VerifyEmailValidator>;
export type ResendTokenPayload = z.infer<typeof ResendTokenValidator>;
export type GetUserEmailPayload = z.infer<typeof GetUserEmailValidator>;