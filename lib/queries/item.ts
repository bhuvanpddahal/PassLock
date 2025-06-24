import Cryptr from "cryptr";
import { Account, Site } from "@prisma/client";

import { db } from "@/lib/db";

interface PreviousPassword {
    siteName: string;
    email: string;
    password: string;
    favoritedAt: Date | null;
    site: {
        canonicalHostname: string;
    };
}

export interface ItemWithReusedPassword extends Account {
    site: Site;
    originalPasswordOf: {
        siteName: string;
        email: string;
        favoritedAt: Date | null;
        site: {
            canonicalHostname: string;
        };
    };
}

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY!);

export const getItemsWithVulnerablePassword = async (
    userId: string,
    page: number,
    limit: number
) => {
    try {
        const rawItems = await db.account.findMany({
            where: {
                userId,
                OR: [
                    { passwordStrength: "TOO_WEAK" },
                    { passwordStrength: "WEAK" }
                ]
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
                userId,
                OR: [
                    { passwordStrength: "TOO_WEAK" },
                    { passwordStrength: "WEAK" }
                ]
            }
        });
        const hasNextPage = totalItems > (page * limit);

        return { items: polishedItems, totalItems, hasNextPage };
    } catch (error) {
        console.error(error);
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
            },
            include: {
                site: true
            },
            orderBy: {
                passwordUpdatedAt: "asc"
            }
        });

        let previousPasswords: PreviousPassword[] = [];
        let itemsWithReusedPasswords: ItemWithReusedPassword[] = [];

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
                        email: previousPasswords[originalPasswordIndex].email,
                        favoritedAt: previousPasswords[originalPasswordIndex].favoritedAt,
                        site: {
                            canonicalHostname: previousPasswords[originalPasswordIndex].site.canonicalHostname
                        }
                    }
                });
            } else { // If password is original
                previousPasswords.push({
                    siteName: initialItems[i].siteName,
                    email: initialItems[i].email,
                    password: decryptedPassword,
                    favoritedAt: initialItems[i].favoritedAt,
                    site: {
                        canonicalHostname: initialItems[i].site.canonicalHostname
                    }
                });
            }
        }

        itemsWithReusedPasswords.reverse();
        const items = itemsWithReusedPasswords.slice((page - 1) * limit, page * limit);
        const totalItems = itemsWithReusedPasswords.length;
        const hasNextPage = totalItems > page * limit;

        return { items, totalItems, hasNextPage };
    } catch (error) {
        console.error(error);
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
                userId,
                site: {
                    isSecured: false
                }
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

        const polishedItems = initialItems.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const totalItems = await db.account.count({
            where: {
                userId,
                site: {
                    isSecured: false
                }
            }
        });
        const hasNextPage = totalItems > page * limit;

        return { items: polishedItems, totalItems, hasNextPage };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getSearchItems = async (
    userId: string,
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
                userId,
                OR: [{
                    siteName: { contains: regexQuery, mode: "insensitive" }
                }, {
                    email: { contains: regexQuery, mode: "insensitive" }
                }]
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

        const polishedItems = items.map((item) => ({
            ...item,
            password: cryptr.decrypt(item.password)
        }));

        const totalItems = await db.account.count({
            where: {
                userId,
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
        console.error(error);
        return null;
    }
};