import Image from "next/image";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import ItemLoader from "../item-loader";
import NotificationsError from "./notifications-error";
import NotificationsLoader from "./notifications-loader";
import { NotificationsData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITEMS_PER_NOTIFICATION } from "../constant";
import { getUserItemsWithVulnerablePassword } from "@/actions/item";

interface fetchItemsWithVulnerablePasswordParams {
    pageParam: number;
}

const VulnerablePasswords = () => {
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

    const items = data?.pages.flatMap((page) => page.items);

    if (status === "pending") return (
        <NotificationsLoader
            title="Vulnerable Passwords"
            Icon={TriangleAlert}
            hasActiveItem
        />
    )
    if (!items) return (
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
                    {items.map((item) => {
                        return item ? (
                            <li key={item.id} className="flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5">
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
                                    <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                                        {item.siteName}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
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