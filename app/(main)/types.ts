import { Account } from "@prisma/client";

export interface ItemsData {
    items: Account[];
    totalItems: number;
    hasNextPage: boolean;
}