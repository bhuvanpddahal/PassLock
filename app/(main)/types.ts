import { Account, Site } from "@prisma/client";

import { ItemWithReusedPassword } from "@/lib/queries/item";

export interface ItemWithSite extends Account {
    site: Site;
}

export interface ItemsData {
    items: ItemWithSite[];
    totalItems: number;
    hasNextPage: boolean;
}

export interface NotificationsData {
    items: ItemWithSite[];
    totalItems: number;
    hasNextPage: boolean;
}

export interface ReusedPasswordsData {
    items: ItemWithReusedPassword[];
    totalItems: number;
    hasNextPage: boolean;
}