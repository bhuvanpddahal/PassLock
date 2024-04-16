import Image from "next/image";
import {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult
} from "@tanstack/react-query";
import { Account } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { ItemsData } from "./types";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ItemsProps {
    items: Account[];
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
    hasNextPage: boolean;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<ItemsData, unknown>, Error>>;
}

const Items = ({
    items,
    activeIndex,
    setActiveIndex,
    hasNextPage,
    fetchNextPage
}: ItemsProps) => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] flex flex-col p-3 text-sm">
            <h3>
                {items.length > 0
                    ? `${items.length} items`
                    : "No items"
                }
            </h3>
            {items && items.length > 0 ? (
                <>
                    <ul className="flex-1 mt-3">
                        {items.map((item, index) => (
                            <li
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5",
                                    index === activeIndex && "bg-primary hover:bg-primary/90"
                                )}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div className="relative">
                                    <Image
                                        src={item.siteIcon ? item.siteIcon : "/padlock.png"}
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
                                        "font-medium text-zinc-900 block -mb-0.5",
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
                        ))}
                    </ul>
                    <Button
                        variant="outline"
                    >
                        Show More Items
                    </Button>
                </>
            ) : (
                <p>
                    No items
                </p>
            )}
        </div>
    )
};

export default Items;