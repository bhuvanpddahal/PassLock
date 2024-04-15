"use server";

import Cryptr from "cryptr";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import {
    CreateItemPayload,
    CreateItemValidator
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