import Image from "next/image";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

import ItemLoader from "../item-loader";
import NotificationsError from "./notifications-error";
import NotificationsLoader from "./notifications-loader";
import { cn } from "@/lib/utils";
import type { Active, Data } from "./page";
import { Badge } from "@/components/ui/badge";
import { ReusedPasswordsData } from "../types";
import { Button } from "@/components/ui/button";
import { ITEMS_PER_NOTIFICATION } from "../constant";
import { getUserItemsWithReusedPassword } from "@/actions/item";

interface fetchItemsWithReusedPasswordParams {
    pageParam: number;
}

interface ReusedPasswordsProps {
    active: Active;
    setActive: Dispatch<SetStateAction<Active>>;
    setData: Dispatch<SetStateAction<Data>>;
}

const ReusedPasswords = ({
    active,
    setActive,
    setData
}: ReusedPasswordsProps) => {
    const fetchItemsWithReusedPassword = async ({
        pageParam
    }: fetchItemsWithReusedPasswordParams) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_NOTIFICATION };
            const data = await getUserItemsWithReusedPassword(payload);
            return data as ReusedPasswordsData;
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
        queryKey: ["favorites", { for: "reused-passwords" }],
        queryFn: fetchItemsWithReusedPassword,
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

    useEffect(() => {
        if (items) {
            setData((prev) => ({ ...prev, reusedPasswords: items }));
        }
    }, [items]);

    if (status === "pending") return (
        <NotificationsLoader
            title="Reused Passwords"
            Icon={RefreshCw}
        />
    )
    if (!items) return (
        <NotificationsError
            title="Reused Passwords"
            Icon={RefreshCw}
        />
    )

    return (
        <div>
            <h4 className="flex items-center justify-between bg-zinc-100 px-3 py-1">
                <div className="flex items-center gap-1 text-slate-700">
                    <RefreshCw className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        Reused Passwords
                    </div>
                </div>
                <Badge variant="destructive">
                    {items.length}
                </Badge>
            </h4>

            {items.length > 0 ? (
                <ul className="p-3">
                    {items.map((item, index) => {
                        const isActive = active.notification === "reusedPasswords"
                            && active.index === index;

                        return item ? (
                            <li
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5",
                                    isActive && "bg-primary hover:bg-primary/90"
                                )}
                                onClick={() => setActive({
                                    notification: "reusedPasswords",
                                    index
                                })}
                            >
                                <div className="relative">
                                    <Image
                                        src="/padlock.png"
                                        alt="Account"
                                        height={40}
                                        width={40}
                                        className="rounded-md"
                                    />
                                </div>
                                <div>
                                    <span className={cn(
                                        "font-medium text-left text-zinc-900 block -mb-0.5",
                                        isActive && "text-zinc-100"
                                    )}>
                                        {item.siteName}
                                    </span>
                                    <span className={cn(
                                        "text-muted-foreground text-xs",
                                        isActive && "text-zinc-100"
                                    )}>
                                        {item.email}
                                    </span>
                                </div>
                            </li>
                        ) : null;
                    })}
                    {hasNextPage && !isFetchingNextPage && (
                        <Button
                            variant="outline"
                            className="mt-2 w-full"
                            onClick={() => {
                                if (fetchNextPage) fetchNextPage();
                            }}
                        >
                            Load More
                        </Button>
                    )}
                    {isFetchingNextPage && <ItemLoader />}
                </ul>
            ) : (
                <p className="text-muted-foreground text-[13px] px-6 py-3">
                    No reused password found.
                </p>
            )}
        </div>
    )
};

export default ReusedPasswords;