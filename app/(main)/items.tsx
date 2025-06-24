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
import { useInView } from "react-intersection-observer";

import ItemImage from "./item-image";
import ItemLoader from "./item-loader";
import ItemsLoader from "./items-loader";
import { cn } from "@/lib/utils";
import { ItemsData, ItemWithSite } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemsProps {
    items: ItemWithSite[] | undefined;
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
    tab?: "dashboard" | "favorites" | "search";
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
    tab = "dashboard"
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
        <div className="sticky top-[calc(4rem+1px)] border-r border-zinc-300 h-[calc(100vh-4rem-1px)] w-[280px] flex flex-col text-sm">
            <h3 className="p-3 pl-6">
                {totalItems > 0
                    ? totalItems === 1 ? "1 item" : `${totalItems} items`
                    : "No items"
                }
            </h3>
            {items && items.length > 0 ? (
                <>
                    <ScrollArea className="h-[calc(100vh-160px)] px-3">
                        <ul>
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
                                            <ItemImage
                                                siteName={item.siteName}
                                                hostname={item.site.canonicalHostname}
                                            />
                                            {item.favoritedAt && (
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
                    </ScrollArea>
                    <p className="text-muted-foreground text-[0.6875rem] mt-3.5 text-center">
                        Your passwords are encrypted before storing.
                    </p>
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
                        {tab === "dashboard" && "Start by creating a new item."}
                        {tab === "favorites" && "No favorited item."}
                        {tab === "search" && "Search result is empty."}
                    </p>
                </div>
            )}
        </div>
    )
};

export default Items;