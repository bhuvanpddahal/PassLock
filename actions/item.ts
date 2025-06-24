"use server";

import Cryptr from "cryptr";
import { cookies } from "next/headers";

import {
    getItemsWithReusedPassword,
    getItemsWithUnsecuredWebsite,
    getItemsWithVulnerablePassword,
    getSearchItems
} from "@/lib/queries/item";
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
    GetUserNotificationValidator,
    GetUserSearchItemsPayload,
    GetUserSearchItemsValidator
} from "@/lib/validators/item";
import { createSite } from "./site";
import { getUserById } from "@/lib/queries/user";
import { getCanonicalHostname } from "@/lib/utils";
import { checkPasswordStrength } from "@/lib/password";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const createItem = async (payload: CreateItemPayload) => {
    try {
        const validatedFields = CreateItemValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const {
            siteName,
            siteLink,
            email,
            password,
            favorited
        } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        let siteId: string;
        const siteUrl = new URL(siteLink);
        const canonicalHostname = getCanonicalHostname(siteUrl.hostname);

        const existingSite = await db.site.findFirst({
            where: {
                canonicalHostname
            }
        });
        if (existingSite) {
            siteId = existingSite.id;
        } else {
            const newSite = await createSite(canonicalHostname);
            siteId = newSite.siteId;
        }

        const encryptedPassword = cryptr.encrypt(password);
        const passwordStrength = checkPasswordStrength(password).value;

        await db.account.create({
            data: {
                siteName,
                siteLink,
                email,
                password: encryptedPassword,
                passwordStrength,
                favoritedAt: favorited ? new Date() : null,
                userId,
                siteId
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
            },
            select: {
                password: true,
                site: {
                    select: {
                        id: true,
                        canonicalHostname: true
                    }
                }
            }
        });
        if (!dbItem) return { error: "Item not found" };

        let siteId = dbItem.site.id;
        const siteUrl = new URL(siteLink);
        const canonicalHostname = getCanonicalHostname(siteUrl.hostname);
        const isSiteUpdated = canonicalHostname !== dbItem.site.canonicalHostname;

        if (isSiteUpdated) {
            const existingSite = await db.site.findFirst({
                where: {
                    canonicalHostname
                }
            });
            if (existingSite) {
                siteId = existingSite.id;
            } else {
                const newSite = await createSite(canonicalHostname);
                siteId = newSite.siteId;
            }
        }

        const isPasswordUpdated = password !== dbItem.password;
        const encryptedPassword = isPasswordUpdated ? cryptr.encrypt(password) : undefined;
        const passwordStrength = isPasswordUpdated ? checkPasswordStrength(password).value : undefined;

        await db.account.update({
            where: {
                id
            },
            data: {
                siteId,
                siteName,
                siteLink,
                email,
                password: encryptedPassword,
                passwordStrength,
                passwordUpdatedAt: isPasswordUpdated ? new Date() : undefined,
                favoritedAt: favorited ? new Date() : null
            }
        });

        const totalSiteItems = await db.account.count({
            where: {
                siteId: dbItem.site.id
            }
        });
        if (totalSiteItems === 0) {
            await db.site.delete({
                where: {
                    id: dbItem.site.id
                }
            });
        }

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
            },
            select: {
                site: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!dbItem) return { error: "Item not found" };

        await db.account.delete({
            where: {
                id
            }
        });

        const totalSiteItems = await db.account.count({
            where: {
                siteId: dbItem.site.id
            }
        });
        if (totalSiteItems === 0) {
            await db.site.delete({
                where: {
                    id: dbItem.site.id
                }
            });
        }

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
            include: {
                site: true
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
                NOT: {
                    favoritedAt: null
                }
            },
            include: {
                site: true
            },
            orderBy: {
                favoritedAt: "desc"
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
                NOT: {
                    favoritedAt: null
                }
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

export const getUserItemsWithUnsecuredWebsite = async (payload: GetUserNotificationPayload) => {
    try {
        const validatedFields = GetUserNotificationValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const data = await getItemsWithUnsecuredWebsite(
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

export const getUserSearchItems = async (payload: GetUserSearchItemsPayload) => {
    try {
        const validatedFields = GetUserSearchItemsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { query, page, limit } = validatedFields.data;

        const userCookie = cookies().get("user");
        if (!userCookie) return { error: "Unauthorized" };

        const userId = JSON.parse(userCookie.value).id || "";

        const dbUser = await getUserById(userId);
        if (!dbUser) return { error: "User not found" };

        const data = await getSearchItems(
            userId,
            query,
            page,
            limit
        );

        return data;
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};