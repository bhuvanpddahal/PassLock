"use server";

import Cryptr from "cryptr";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import {
    CreateItemPayload,
    CreateItemValidator,
    GetUserItemsPayload,
    GetUserItemsValidator
} from "@/lib/validators/item";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const createItem = async (payload: CreateItemPayload) => {
    try {
        const validatedFields = CreateItemValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { siteName, siteLink, siteIcon, email, password } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await db.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!dbUser) return { error: "User not found" };

        const encryptedPassword = cryptr.encrypt(password);

        await db.account.create({
            data: {
                siteName,
                siteLink,
                siteIcon,
                email,
                password: encryptedPassword,
                userId
            }
        });

        return { success: "Item created successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getUserItems = async (payload: GetUserItemsPayload) => {
    try {
        const validatedFields = GetUserItemsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const rawItems = await db.account.findMany({
            where: {
                userId
            },
            orderBy: {
                addedAt: "desc"
            },
            take: limit,
            skip: (page - 1) * limit
        });

        const polishedItems = rawItems.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const totalItems = await db.account.count({
            where: {
                userId
            }
        });
        const hasNextPage = totalItems > (page * limit);

        return { items: polishedItems, totalItems, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};