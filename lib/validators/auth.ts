import { z } from "zod";

export const SigninValidator = z.object({
    email: z.string().email({
        message: "Email is invalid"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
});

export const FirstStepValidator = z.object({
    email: z.string().email({
        message: "Email is invalid"
    })
});

export const ThirdStepValidator = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }),
    confirmPassword: z.string(),
    username: z.union([
        z.string().optional(),
        z.string().min(5, {
            message: "Username must be at least 5 characters long"
        })
    ])
}).refine((args) => args.password === args.confirmPassword, {
    message: "Password is not matching",
    path: ["confirmPassword"]
});

export const SignupValidator = z.object({
    email: z.string().email({
        message: "Email is invalid"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    }),
    username: z.union([
        z.string().optional(),
        z.string().min(5, {
            message: "Username must be at least 5 characters long"
        })
    ])
});

export const VerifyEmailValidator = z.object({
    email: z.string().email(),
    token: z.string()
});

export const ResendTokenValidator = z.object({
    email: z.string().email()
});

export type SigninPayload = z.infer<typeof SigninValidator>;
export type FirstStepPayload = z.infer<typeof FirstStepValidator>;
export type ThirdStepPayload = z.infer<typeof ThirdStepValidator>;
export type SignupPayload = z.infer<typeof SignupValidator>;
export type VerifyEmailPayload = z.infer<typeof VerifyEmailValidator>;
export type ResendTokenPayload = z.infer<typeof ResendTokenValidator>;