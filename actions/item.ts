"use server";

import Cryptr from "cryptr";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import {
    CreateItemPayload,
    CreateItemValidator,
    DeleteItemPayload,
    DeleteItemValidator,
    EditItemPayload,
    EditItemValidator,
    GetUserItemsPayload,
    GetUserItemsValidator,
    GetUserNotificationPayload,
    GetUserNotificationValidator
} from "@/lib/validators/item";
import {
    getItemsWithReusedPassword,
    getItemsWithVulnerablePassword
} from "@/lib/queries/item";
import { getUserById } from "@/lib/queries/user";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const createItem = async (payload: CreateItemPayload) => {
    try {
        const validatedFields = CreateItemValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const {
            siteName,
            siteLink,
            siteIcon,
            email,
            password,
            favorited
        } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const encryptedPassword = cryptr.encrypt(password);

        await db.account.create({
            data: {
                siteName,
                siteLink,
                siteIcon,
                email,
                password: encryptedPassword,
                favorited,
                userId
            }
        });

        return { success: "Item created successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const editItem = async (payload: EditItemPayload) => {
    try {
        const validatedFields = EditItemValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const {
            id,
            siteName,
            siteLink,
            siteIcon,
            email,
            password,
            favorited
        } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const dbItem = await db.account.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!dbItem) return { error: "Item not found" };

        const encryptedPassword = cryptr.encrypt(password);

        await db.account.update({
            where: {
                id
            },
            data: {
                siteName,
                siteLink,
                siteIcon,
                email,
                password: encryptedPassword,
                favorited
            }
        });

        return { success: "Item updated successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const deleteItem = async (payload: DeleteItemPayload) => {
    try {
        const validatedFields = DeleteItemValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { id } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const dbItem = await db.account.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!dbItem) return { error: "Item not found" };

        await db.account.delete({
            where: {
                id
            }
        });

        return { success: "Item deleted successfully" };
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

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

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

export const getUserFavoritedItems = async (payload: GetUserItemsPayload) => {
    try {
        const validatedFields = GetUserItemsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const rawItems = await db.account.findMany({
            where: {
                userId,
                favorited: true
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
                userId,
                favorited: true
            }
        });
        const hasNextPage = totalItems > (page * limit);

        return { items: polishedItems, totalItems, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getUserItemsWithVulnerablePassword = async (payload: GetUserNotificationPayload) => {
    try {
        const validatedFields = GetUserNotificationValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const data = await getItemsWithVulnerablePassword(
            userId,
            page,
            limit
        );

        return data;
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getUserItemsWithReusedPassword = async (payload: GetUserNotificationPayload) => {
    try {
        const validatedFields = GetUserNotificationValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const data = await getItemsWithReusedPassword(
            userId,
            page,
            limit
        );

        return data;
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};