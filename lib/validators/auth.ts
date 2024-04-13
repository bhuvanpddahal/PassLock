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

export type SignupPayload = z.infer<typeof SignupValidator>;
export type SigninPayload = z.infer<typeof SigninValidator>;