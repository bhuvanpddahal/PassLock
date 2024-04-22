import { z } from "zod";

export const SignupValidator = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Email is invalid"
    }),
    masterPassword: z.string().min(1, {
        message: "Master password is required"
    })
});

export const SigninValidator = z.object({
    email: z.string().email({
        message: "Email is invalid"
    }),
    masterPassword: z.string().min(1, {
        message: "Master password is required"
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

export type SignupPayload = z.infer<typeof SignupValidator>;
export type SigninPayload = z.infer<typeof SigninValidator>;
export type VerifyEmailPayload = z.infer<typeof VerifyEmailValidator>;
export type ResendTokenPayload = z.infer<typeof ResendTokenValidator>;
export type GetUserEmailPayload = z.infer<typeof GetUserEmailValidator>;