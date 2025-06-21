import Cryptr from "cryptr";
import { passwordStrength } from "check-password-strength";

import { db } from "@/lib/db";
import { Account } from "@prisma/client";

interface PreviousPassword {
    siteName: string;
    siteLink: string;
    email: string;
    password: string;
    favorited: boolean;
}

export interface Item extends Account {
    originalPasswordOf: {
        siteName: string;
        siteLink: string;
        email: string;
        favorited: boolean;
    };
}

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const getItemsWithVulnerablePassword = async (
    userId: string,
    page: number,
    limit: number
) => {
    try {
        const initialItems = await db.account.findMany({
            where: {
                userId
            },
            orderBy: {
                addedAt: "desc"
            }
        });

        const filteredItems = initialItems.filter((item) => {
            const decryptedPassword = cryptr.decrypt(item.password);
            const passwordStrengthId = passwordStrength(decryptedPassword).id;
            return passwordStrengthId < 2;
        });

        const polishedItems = filteredItems.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const items = polishedItems.slice((page - 1) * limit, page * limit);
        const totalItems = polishedItems.length;
        const hasNextPage = polishedItems.length > page * limit;

        return { items, totalItems, hasNextPage };
    } catch (error) {
        return null;
    }
};

export const getItemsWithReusedPassword = async (
    userId: string,
    page: number,
    limit: number
) => {
    try {
        const initialItems = await db.account.findMany({
            where: {
                userId
            }
        });

        let previousPasswords: PreviousPassword[] = [];
        let itemsWithReusedPasswords: Item[] = [];

        for (let i = 0; i < initialItems.length; ++i) {
            const encryptedPassword = initialItems[i].password;
            const decryptedPassword = cryptr.decrypt(encryptedPassword);

            const originalPasswordIndex = previousPasswords.findIndex(
                (item) => item.password === decryptedPassword
            );

            if (originalPasswordIndex !== -1) { // If password is reused
                itemsWithReusedPasswords.push({
                    ...initialItems[i],
                    password: decryptedPassword,
                    originalPasswordOf: {
                        siteName: previousPasswords[originalPasswordIndex].siteName,
                        siteLink: previousPasswords[originalPasswordIndex].siteLink,
                        email: previousPasswords[originalPasswordIndex].email,
                        favorited: previousPasswords[originalPasswordIndex].favorited
                    }
                });
            } else { // If password is original
                previousPasswords.push({
                    siteName: initialItems[i].siteName,
                    siteLink: initialItems[i].siteLink,
                    email: initialItems[i].email,
                    password: decryptedPassword,
                    favorited: initialItems[i].favorited
                });
            }
        }

        const reversedItems = itemsWithReusedPasswords.reverse();
        const items = reversedItems.slice((page - 1) * limit, page * limit);
        const totalItems = reversedItems.length;
        const hasNextPage = reversedItems.length > page * limit;

        return { items, totalItems, hasNextPage };
    } catch (error) {
        return null;
    }
};

export const getItemsWithUnsecuredWebsite = async (
    userId: string,
    page: number,
    limit: number
) => {
    try {
        const initialItems = await db.account.findMany({
            where: {
                userId
            },
            orderBy: {
                addedAt: "desc"
            }
        });

        const filteredItems = initialItems.filter(
            (item) => !item.siteLink.includes("https://")
        );

        const polishedItems = filteredItems.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const items = polishedItems.slice((page - 1) * limit, page * limit);
        const totalItems = polishedItems.length;
        const hasNextPage = polishedItems.length > page * limit;

        return { items, totalItems, hasNextPage };
    } catch (error) {
        return null;
    }
};

export const getSearchItems = async (
    query: string,
    page: number,
    limit: number
) => {
    try {
        // Escape special characters in the query string to avoid regex injection
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Construct the regex pattern for case-insensitive search
        const regexPattern = new RegExp(escapedQuery, 'i');

        // Convert the regex pattern to a string
        const regexQuery = regexPattern.source;

        const items = await db.account.findMany({
            where: {
                OR: [{
                    siteName: { contains: regexQuery, mode: "insensitive" }
                }, {
                    email: { contains: regexQuery, mode: "insensitive" }
                }]
            },
            orderBy: {
                addedAt: "desc"
            },
            take: limit,
            skip: (page - 1) * limit
        });

        const polishedItems = items.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const totalItems = await db.account.count({
            where: {
                OR: [{
                    siteName: { contains: regexQuery, mode: "insensitive" }
                }, {
                    email: { contains: regexQuery, mode: "insensitive" }
                }]
            }
        });
        const hasNextPage = totalItems > (page * limit);

        return { items: polishedItems, totalItems, hasNextPage };
    } catch (error) {
        return null;
    }
};