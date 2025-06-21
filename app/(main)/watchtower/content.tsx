"use client";

import { useState } from "react";
import { Account } from "@prisma/client";

import AllGood from "./all-good";
import FetchError from "../fetch-error";
import ItemContent from "../item-content";
import Notifications from "./notifications";
import WarningBanner from "./warning-banner";
import ItemContentLoader from "../item-content-loader";
import type { Item } from "@/lib/queries/item";
import { Skeleton } from "@/components/ui/skeleton";

export interface Data {
    vulnerablePasswords: Account[];
    reusedPasswords: Item[];
    unsecuredWebsites: Account[];
}

export interface Active {
    notification: keyof Data;
    index: number;
}

interface Status {
    isFetching: boolean;
    isError: boolean;
}

export interface NotificationStatus {
    vulnerablePasswords: Status;
    reusedPasswords: Status;
    unsecuredWebsites: Status;
}

const WatchtowerContent = () => {
    const [data, setData] = useState<Data>({
        vulnerablePasswords: [],
        reusedPasswords: [],
        unsecuredWebsites: []
    });
    const [active, setActive] = useState<Active>({
        notification: "vulnerablePasswords",
        index: 0
    });
    const initialNotificationStatus: Status = {
        isFetching: true,
        isError: false
    };
    const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>({
        vulnerablePasswords: initialNotificationStatus,
        reusedPasswords: initialNotificationStatus,
        unsecuredWebsites: initialNotificationStatus
    });
    const originalPasswordOf = data.reusedPasswords[active.index]?.originalPasswordOf;

    return (
        <div className="flex-1 flex">
            <Notifications
                active={active}
                setActive={setActive}
                data={data}
                setData={setData}
                notificationStatus={notificationStatus}
                setNotificationStatus={setNotificationStatus}
            />
            <div className="flex-1">
                {notificationStatus[active.notification].isFetching ? (
                    <>
                        <Skeleton className="h-[100px] m-3" />
                        <ItemContentLoader />
                    </>
                ) : notificationStatus[active.notification].isError ? (
                    <FetchError />
                ) : data[active.notification][active.index] ? (
                    <>
                        <WarningBanner
                            activeNotification={active.notification}
                            originalPasswordOf={originalPasswordOf}
                        />
                        <ItemContent
                            id={data[active.notification][active.index].id}
                            siteName={data[active.notification][active.index].siteName}
                            siteLink={data[active.notification][active.index].siteLink}
                            email={data[active.notification][active.index].email}
                            password={data[active.notification][active.index].password}
                            favorited={data[active.notification][active.index].favorited}
                            addedAt={data[active.notification][active.index].addedAt}
                        />
                    </>
                ) : (
                    <AllGood />
                )}
            </div>
        </div>
    )
};

export default WatchtowerContent;