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
    }),
    favorited: z.boolean()
});

export const EditItemValidator = z.object({
    id: z.string(),
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
    }),
    favorited: z.boolean()
});

export const GetUserItemsValidator = z.object({
    page: z.number(),
    limit: z.number()
});

export type CreateItemPayload = z.infer<typeof CreateItemValidator>;
export type EditItemPayload = z.infer<typeof EditItemValidator>;
export type GetUserItemsPayload = z.infer<typeof GetUserItemsValidator>;