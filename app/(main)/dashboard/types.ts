import { Account } from "@prisma/client";

export interface ItemsData {
    items: Account[];
    hasNextPage: boolean;
}