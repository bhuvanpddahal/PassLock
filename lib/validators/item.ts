import { z } from "zod";

export const CreateItemValidator = z.object({
    siteName: z.string().min(1, {
        message: "Site name is required"
    }),
    siteLink: z.string().url({
        message: "Invalid URL"
    }),
    siteIcon: z.string().optional(),
    email: z.string().email({
        message: "Email is invalid"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
});

export const GetUserItemsValidator = z.object({
    page: z.number(),
    limit: z.number()
});

export type CreateItemPayload = z.infer<typeof CreateItemValidator>;
export type GetUserItemsPayload = z.infer<typeof GetUserItemsValidator>;