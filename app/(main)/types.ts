import { Account } from "@prisma/client";

import { Item } from "@/lib/queries/item";

export interface ItemsData {
    items: Account[];
    totalItems: number;
    hasNextPage: boolean;
}

export interface NotificationsData {
    items: Account[];
    totalItems: number;
    hasNextPage: boolean;
}

export interface ReusedPasswordsData {
    items: Item[];
    totalItems: number;
    hasNextPage: boolean;
}