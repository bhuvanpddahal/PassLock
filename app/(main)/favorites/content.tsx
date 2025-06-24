"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Items from "../items";
import FetchError from "../fetch-error";
import NoFavorites from "./no-favorites";
import ItemContent from "../item-content";
import ItemContentLoader from "../item-content-loader";
import { ItemsData } from "../types";
import { ITEMS_PER_PAGE } from "../constant";
import { getUserFavoritedItems } from "@/actions/item";

interface FetchItemsProps {
    pageParam: number;
}

const FavoritesContent = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchItems = async ({ pageParam }: FetchItemsProps) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_PAGE };
            const data = await getUserFavoritedItems(payload);
            return data as ItemsData;
        } catch (error) {
            toast.error("Something went wrong");
            return { items: [], totalItems: 0, hasNextPage: false };
        }
    };

    const {
        data,
        status,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["favorites"],
        queryFn: fetchItems,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasNextPage) {
                return pages.length + 1;
            } else {
                return null;
            }
        }
    });

    const items = data?.pages.flatMap((page) => page.items);

    return (
        <div className="flex-1 flex">
            <Items
                items={items}
                status={status}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                totalItems={data?.pages[data.pages.length - 1].totalItems || 0}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                tab="favorites"
            />
            {items && items.length > 0 && items[0] && (
                <ItemContent
                    id={items[activeIndex].id}
                    siteName={items[activeIndex].siteName}
                    siteLink={items[activeIndex].siteLink}
                    email={items[activeIndex].email}
                    password={items[activeIndex].password}
                    passwordStrength={items[activeIndex].passwordStrength}
                    addedAt={items[activeIndex].addedAt}
                    favoritedAt={items[activeIndex].favoritedAt}
                    site={items[activeIndex].site}
                />
            )}
            {items && items.length === 0 && (
                <NoFavorites />
            )}
            {!items && status === "pending" && (
                <ItemContentLoader />
            )}
            {(!items && status !== "pending") || (items && items.length > 0 && !items[0]) && (
                <FetchError />
            )}
        </div>
    )
};

export default FavoritesContent;