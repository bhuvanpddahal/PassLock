import Image from "next/image";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

import ItemLoader from "../item-loader";
import NotificationsError from "./notifications-error";
import NotificationsLoader from "./notifications-loader";
import { cn } from "@/lib/utils";
import { NotificationsData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITEMS_PER_NOTIFICATION } from "../constant";
import type { Active, Data, NotificationStatus } from "./page";
import { getUserItemsWithVulnerablePassword } from "@/actions/item";

interface fetchItemsWithVulnerablePasswordParams {
    pageParam: number;
}

interface VulnerablePasswordsProps {
    active: Active;
    setActive: Dispatch<SetStateAction<Active>>;
    notificationsData: Data;
    setData: Dispatch<SetStateAction<Data>>;
    notificationStatus: NotificationStatus;
    setNotificationStatus: Dispatch<SetStateAction<NotificationStatus>>;
}

const VulnerablePasswords = ({
    active,
    setActive,
    notificationsData,
    setData,
    notificationStatus,
    setNotificationStatus
}: VulnerablePasswordsProps) => {
    const fetchItemsWithVulnerablePassword = async ({
        pageParam
    }: fetchItemsWithVulnerablePasswordParams) => {
        try {
            const payload = { page: pageParam, limit: ITEMS_PER_NOTIFICATION };
            const data = await getUserItemsWithVulnerablePassword(payload);
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
        queryKey: ["watchtower", { for: "vulnerable-passwords" }],
        queryFn: fetchItemsWithVulnerablePassword,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasNextPage) {
                return pages.length + 1;
            } else {
                return null;
            }
        }
    });

    const setStatus = (isFetching: boolean, isError: boolean) => {
        setNotificationStatus((prev) => ({
            ...prev,
            vulnerablePasswords: {
                isFetching,
                isError
            }
        }));
    };

    const changeActive = (status: "empty" | "error") => {
        // Code to switch the active item since the current item is either empty,
        // or there was an error fetching the current item
        if (status === "empty") {
            if (notificationsData.reusedPasswords.length > 0) {
                setActive({ notification: "reusedPasswords", index: 0 });
            } else if (notificationsData.unsecuredWebsites.length > 0) {
                setActive({ notification: "unsecuredWebsites", index: 0 });
            } else if (notificationStatus.reusedPasswords.isFetching) {
                setActive({ notification: "reusedPasswords", index: 0 });
            } else if (notificationStatus.unsecuredWebsites.isFetching) {
                setActive({ notification: "unsecuredWebsites", index: 0 });
            } else if (notificationStatus.reusedPasswords.isError) {
                setActive({ notification: "reusedPasswords", index: 0 });
            } else if (notificationStatus.unsecuredWebsites.isError) {
                setActive({ notification: "unsecuredWebsites", index: 0 });
            }
        } else {
            if (notificationsData.reusedPasswords.length > 0) {
                setActive({ notification: "reusedPasswords", index: 0 });
            } else if (notificationsData.unsecuredWebsites.length > 0) {
                setActive({ notification: "unsecuredWebsites", index: 0 });
            } else if (notificationStatus.reusedPasswords.isFetching) {
                setActive({ notification: "reusedPasswords", index: 0 });
            } else if (notificationStatus.unsecuredWebsites.isFetching) {
                setActive({ notification: "unsecuredWebsites", index: 0 });
            }
        }
    };

    const items = data?.pages.flatMap((page) => page.items);

    useEffect(() => {
        if (items) {
            if (items.length > 0) { // If there is atleast one item
                if (items[0]) { /// If the data is fetched successfully
                    if (notificationsData.vulnerablePasswords.length === items.length) return;
                    setData((prev) => ({ ...prev, vulnerablePasswords: items }));
                    if (notificationStatus.vulnerablePasswords.isFetching) {
                        setStatus(false, false);
                    }
                } else { // If there was an error trying to fetch the data
                    if (!notificationStatus.vulnerablePasswords.isError) {
                        setStatus(false, true);
                    }
                    if (active.notification === "vulnerablePasswords") {
                        changeActive("error");
                    }
                }
            } else { // If there is no item with vulnerable password
                if (notificationStatus.vulnerablePasswords.isFetching) {
                    setStatus(false, false);
                }
                if (active.notification === "vulnerablePasswords") {
                    changeActive("empty");
                }
            }
        }
    }, [
        items,
        setData,
        active.notification,
        changeActive,
        notificationStatus.vulnerablePasswords.isError,
        notificationStatus.vulnerablePasswords.isFetching,
        notificationsData.vulnerablePasswords.length,
        setStatus
    ]);

    if (status === "pending") return (
        <NotificationsLoader
            title="Vulnerable Passwords"
            Icon={TriangleAlert}
            hasActiveItem
        />
    )
    if (!items || (items.length > 0 && !items[0])) return (
        <NotificationsError
            title="Vulnerable Passwords"
            Icon={TriangleAlert}
        />
    )

    return (
        <div>
            <h4 className="flex items-center justify-between bg-zinc-100 px-3 py-1">
                <div className="flex items-center gap-1 text-slate-700">
                    <TriangleAlert className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        Vulnerable Passwords
                    </div>
                </div>
                <Badge variant="destructive">
                    {items.length}
                </Badge>
            </h4>

            {items.length > 0 ? (
                <ul className="p-3">
                    {items.map((item, index) => {
                        const isActive = active.notification === "vulnerablePasswords"
                            && active.index === index;

                        return item ? (
                            <li
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5",
                                    isActive && "bg-primary hover:bg-primary/90"
                                )}
                                onClick={() => setActive({
                                    notification: "vulnerablePasswords",
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
                    No vulnerable password found.
                </p>
            )}
        </div>
    )
};

export default VulnerablePasswords;