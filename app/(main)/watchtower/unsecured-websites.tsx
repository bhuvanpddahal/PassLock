import { toast } from "sonner";
import { ShieldOff } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

import ItemImage from "../item-image";
import ItemLoader from "../item-loader";
import NotificationsError from "./notifications-error";
import NotificationsLoader from "./notifications-loader";
import { cn } from "@/lib/utils";
import { NotificationsData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITEMS_PER_NOTIFICATION } from "../constant";
import { getUserItemsWithUnsecuredWebsite } from "@/actions/item";
import type { Active, Data, NotificationStatus } from "./content";

interface fetchItemsWithUnsecuredWebsiteParams {
    pageParam: number;
}

interface UnsecuredWebsitesProps {
    active: Active;
    setActive: Dispatch<SetStateAction<Active>>;
    notificationsData: Data;
    setData: Dispatch<SetStateAction<Data>>;
    notificationStatus: NotificationStatus;
    setNotificationStatus: Dispatch<SetStateAction<NotificationStatus>>;
}

const UnsecuredWebsites = ({
    active,
    setActive,
    notificationsData,
    setData,
    notificationStatus,
    setNotificationStatus
}: UnsecuredWebsitesProps) => {
    const fetchItemsWithUnsecuredWebsite = async ({
        pageParam
    }: fetchItemsWithUnsecuredWebsiteParams) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_NOTIFICATION };
            const data = await getUserItemsWithUnsecuredWebsite(payload);
            return data as NotificationsData;
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
        queryKey: ["watchtower", { for: "unsecured-websites" }],
        queryFn: fetchItemsWithUnsecuredWebsite,
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
        const setStatus = (isFetching: boolean, isError: boolean) => {
            setNotificationStatus((prev) => ({
                ...prev,
                unsecuredWebsites: {
                    isFetching,
                    isError
                }
            }));
        };

        const changeActive = (status: "empty" | "error") => {
            // Code to switch the active item since the current item is either empty,
            // or there was an error fetching the current item
            if (status === "empty") {
                if (notificationsData.vulnerablePasswords.length > 0) {
                    setActive({ notification: "vulnerablePasswords", index: 0 });
                } else if (notificationsData.reusedPasswords.length > 0) {
                    setActive({ notification: "reusedPasswords", index: 0 });
                } else if (notificationStatus.vulnerablePasswords.isFetching) {
                    setActive({ notification: "vulnerablePasswords", index: 0 });
                } else if (notificationStatus.reusedPasswords.isFetching) {
                    setActive({ notification: "reusedPasswords", index: 0 });
                } else if (notificationStatus.vulnerablePasswords.isError) {
                    setActive({ notification: "vulnerablePasswords", index: 0 });
                } else if (notificationStatus.reusedPasswords.isError) {
                    setActive({ notification: "reusedPasswords", index: 0 });
                }
            } else {
                if (notificationsData.vulnerablePasswords.length > 0) {
                    setActive({ notification: "vulnerablePasswords", index: 0 });
                } else if (notificationsData.reusedPasswords.length > 0) {
                    setActive({ notification: "reusedPasswords", index: 0 });
                } else if (notificationStatus.vulnerablePasswords.isFetching) {
                    setActive({ notification: "vulnerablePasswords", index: 0 });
                } else if (notificationStatus.reusedPasswords.isFetching) {
                    setActive({ notification: "reusedPasswords", index: 0 });
                }
            }
        };

        if (items) {
            if (items.length > 0) { // If there is atleast one item
                if (items[0]) { /// If the data is fetched successfully
                    if (notificationsData.unsecuredWebsites.length === items.length) return;
                    setData((prev) => ({ ...prev, unsecuredWebsites: items }));
                    if (notificationStatus.unsecuredWebsites.isFetching) {
                        setStatus(false, false);
                    }
                } else { // If there was an error trying to fetch the data
                    if (!notificationStatus.unsecuredWebsites.isError) {
                        setStatus(false, true);
                    }
                    if (active.notification === "unsecuredWebsites") {
                        changeActive("error");
                    }
                }
            } else { // If there is no item with unsecured website
                if (notificationStatus.unsecuredWebsites.isFetching) {
                    setStatus(false, false);
                }
                if (active.notification === "unsecuredWebsites") {
                    changeActive("empty");
                }
            }
        }
    }, [
        items,
        setData,
        active.notification,
        notificationStatus.unsecuredWebsites.isError,
        notificationStatus.unsecuredWebsites.isFetching,
        notificationsData.unsecuredWebsites.length
    ]);

    if (status === "pending") return (
        <NotificationsLoader
            title="Unsecured Websites"
            Icon={ShieldOff}
            hasActiveItem={active.notification === "unsecuredWebsites"}
        />
    )
    if (!items || (items.length > 0 && !items[0])) return (
        <NotificationsError
            title="Unsecured Websites"
            Icon={ShieldOff}
        />
    )

    return (
        <div>
            <h4 className="sticky top-0 flex items-center justify-between bg-zinc-100 px-3 py-1 z-10">
                <div className="flex items-center gap-1 text-slate-700">
                    <ShieldOff className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        Unsecured Websites
                    </div>
                </div>
                <Badge variant="destructive">
                    {items.length}
                </Badge>
            </h4>

            {items.length > 0 ? (
                <ul className="p-3">
                    {items.map((item, index) => {
                        const isActive = active.notification === "unsecuredWebsites"
                            && active.index === index;

                        return item ? (
                            <li
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5",
                                    isActive && "bg-primary hover:bg-primary/90"
                                )}
                                onClick={() => setActive({
                                    notification: "unsecuredWebsites",
                                    index
                                })}
                            >
                                <div className="relative">
                                    <ItemImage
                                        siteName={item.siteName}
                                        hostname={item.site.canonicalHostname}
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
                    No unsecured website found.
                </p>
            )}
        </div>
    )
};

export default UnsecuredWebsites;