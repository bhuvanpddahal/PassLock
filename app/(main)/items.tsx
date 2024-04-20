import Image from "next/image";
import {
    Dispatch,
    SetStateAction,
    useEffect
} from "react";
import {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult
} from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Account } from "@prisma/client";
import { useInView } from "react-intersection-observer";

import ItemLoader from "./item-loader";
import ItemsLoader from "./items-loader";
import { cn } from "@/lib/utils";
import { ItemsData } from "./types";

interface ItemsProps {
    items: Account[] | undefined;
    status: "error" | "success" | "pending";
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
    totalItems: number;
    hasNextPage: boolean;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<ItemsData | {
        items: never[];
        hasNextPage: boolean;
    }, unknown>, Error>>;
    isFetchingNextPage: boolean;
    isSearching?: boolean;
}

const Items = ({
    items,
    status,
    activeIndex,
    setActiveIndex,
    totalItems,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isSearching = false
}: ItemsProps) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            if (fetchNextPage) fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (status === "pending") return <ItemsLoader />
    if (!items) return null;

    return (
        <div className="sticky top-[68px] border-r border-zinc-300 h-full w-[280px] flex flex-col text-sm">
            <h3 className="p-3 pl-6">
                {totalItems > 0
                    ? totalItems === 1 ? "1 item" : `${totalItems} items`
                    : "No items"
                }
            </h3>
            {items && items.length > 0 ? (
                <>
                    <ul className="h-[calc(100vh-124px)] overflow-y-auto px-3">
                        {items.map((item, index) => {
                            return item ? (
                                <li
                                    key={item.id}
                                    ref={index === items.length - 1 ? ref : undefined}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5",
                                        index === activeIndex && "bg-primary hover:bg-primary/90"
                                    )}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className="relative">
                                        <Image
                                            src="/padlock.png"
                                            alt="Account"
                                            height={40}
                                            width={40}
                                            className="rounded-md"
                                        />
                                        {item.favorited && (
                                            <div className="absolute top-full left-full p-0.5 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full">
                                                <Star
                                                    className="h-3 w-3"
                                                    style={{ fill: "whitesmoke", color: "#aaa" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "font-medium text-left text-zinc-900 block -mb-0.5",
                                            index === activeIndex && "text-zinc-100"
                                        )}>
                                            {item.siteName}
                                        </span>
                                        <span className={cn(
                                            "text-muted-foreground text-xs",
                                            index === activeIndex && "text-zinc-100"
                                        )}>
                                            {item.email}
                                        </span>
                                    </div>
                                </li>
                            ) : null;
                        })}
                        {isFetchingNextPage && (
                            Array.from({ length: 3 }, (_, index) => (
                                <ItemLoader key={index} />
                            ))
                        )}
                    </ul>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-y-2">
                    <Image
                        src="/empty-box.png"
                        alt="No items"
                        height={80}
                        width={80}
                    />
                    <p className="text-muted-foreground">
                        {isSearching
                            ? "Search result is empty."
                            : "Start by creating a new item."
                        }
                    </p>
                </div>
            )}
        </div>
    )
};

export default Items;