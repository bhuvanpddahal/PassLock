"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Items from "./items";
import ItemContent from "./item-content";
import { ItemsData } from "./types";
import { ITEMS_PER_PAGE } from "./constant";
import { getUserItems } from "@/actions/item";

interface FetchItemsProps {
    pageParam: number;
}

const DashboardPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchItems = async ({ pageParam }: FetchItemsProps) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_PAGE };
            const data = await getUserItems(payload);
            return data as ItemsData;
        } catch (error) {
            toast.error("Something went wrong");
            return { items: [], hasNextPage: false };
        }
    };

    const {
        data,
        error,
        status,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["/dashboard"],
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
    
    if (status === "pending") return (
        <div className="flex-1 w-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-zinc-800 animate-spin" />
        </div>
    )

    if(!items || !items[activeIndex]) return null;

    return (
        <div className="flex-1 flex">
            <Items
                items={items}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            />
            <ItemContent
                siteName={items[activeIndex].siteName}
                siteLink={items[activeIndex].siteLink}
                siteIcon={items[activeIndex].siteIcon}
                email={items[activeIndex].email}
                password={items[activeIndex].password}
                favorited={items[activeIndex].favorited}
            />
        </div>
    )
};

export default DashboardPage;