"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Items from "./items";
import ItemContent from "./item-content";
import ItemContentLoader from "./item-content-loader";
import { ItemsData } from "./types";
import { ITEMS_PER_PAGE } from "./constant";
import { getUserItems } from "@/actions/item";
import { Button } from "@/components/ui/button";
import { useNewItem } from "@/hooks/use-new-item-modal";

interface FetchItemsProps {
    pageParam: number;
}

const DashboardPage = () => {
    const { open } = useNewItem();
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchItems = async ({ pageParam }: FetchItemsProps) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_PAGE };
            const data = await getUserItems(payload);
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
        queryKey: ["dashboard"],
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
            />
            {items
                ? items[activeIndex] ? (
                    <ItemContent
                        id={items[activeIndex].id}
                        siteName={items[activeIndex].siteName}
                        siteLink={items[activeIndex].siteLink}
                        siteIcon={items[activeIndex].siteIcon}
                        email={items[activeIndex].email}
                        password={items[activeIndex].password}
                        favorited={items[activeIndex].favorited}
                    />
                ) : (
                    <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center">
                        <Image
                            src="/fireworks.png"
                            alt="Pyro"
                            height={100}
                            width={100}
                        />
                        <div>
                            <h2 className="text-lg font-bold text-zinc-800 text-center">
                                Welcome to PassLock!
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-lg text-center">
                                Setup your journey of managing your passwords the correct way.
                            </p>
                        </div>
                        <div className="relative mt-[60px]">
                            <div className="absolute -top-10 left-12 text-sm bg-slate-800 text-zinc-100 px-3 py-2.5 rounded-sm animate-bounce">
                                Click Here
                                <div
                                    className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-slate-800 transform -translate-x-1/2"
                                />
                            </div>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-pink-500"
                                onClick={open}
                            >
                                Create My First Item
                            </Button>
                        </div>
                    </div>
                ) : status === "pending" ? (
                    <ItemContentLoader />
                ) : (
                    <div className="flex-1 p-3 pl-4 flex flex-col items-center justify-center gap-y-2">
                        <Image
                            src="/error.png"
                            alt="Error"
                            height={60}
                            width={60}
                        />
                        <div>
                            <h2 className="text-lg font-bold text-zinc-800 text-center">
                                An error occurred!
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-lg text-center">
                                Oops, something went wrong while trying to get the data. Please refresh the site to try again.
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    )
};

export default DashboardPage;