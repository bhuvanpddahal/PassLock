"use client";

import Image from "next/image";
import { useState } from "react";
import { Account } from "@prisma/client";
import { CircleAlert, Star } from "lucide-react";

import FetchError from "../fetch-error";
import ItemContent from "../item-content";
import Notifications from "./notifications";
import EverythingGood from "./everything-good";
import ItemContentLoader from "../item-content-loader";
import { Item } from "@/lib/queries/item";

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

const WatchtowerPage = () => {
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

    console.log("notificationStatus: ", notificationStatus);

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
                        <div className="h-[100px] bg-zinc-300 m-3 rounded-md animate-pulse" />
                        <ItemContentLoader />
                    </>
                ) : notificationStatus[active.notification].isError ? (
                    <FetchError />
                ) : data[active.notification][active.index] ? (
                    <>
                        <div className="m-3 bg-destructive text-destructive-foreground rounded-md p-3 flex gap-3">
                            <CircleAlert className="h-5 w-5 shrink-0" />
                            {active.notification === "vulnerablePasswords" && (
                                <p className="text-[13px]">
                                    It seems like your password is not strong enough to protect your account effectively. Strong passwords are crucial for keeping your personal information secure.
                                    <br />
                                    PassLock recommends to create a new password with a mix of uppercase letters, lowercase letters, numbers, and special characters and stay away from easily guessable phrases, such as &quot;password123&quot; or &quot;qwerty&quot;.
                                </p>
                            )}
                            {active.notification === "reusedPasswords" && (
                                <div className="text-[13px]">
                                    It appears that you&apos;ve used this password for multiple accounts. Reusing passwords across different platforms significantly increases the risk of your accounts being compromised. This password was originally used in the following account:
                                    <span className="flex items-center gap-2 p-3">
                                        <div className="relative">
                                            <Image
                                                src="/padlock.png"
                                                alt="Account"
                                                height={40}
                                                width={40}
                                                className="rounded-md"
                                            />
                                            {originalPasswordOf.favorited && (
                                                <div className="absolute top-full left-full p-0.5 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full">
                                                    <Star
                                                        className="h-3 w-3"
                                                        style={{ fill: "whitesmoke", color: "#aaa" }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-zinc-100">
                                            <span className="font-medium text-left block -mb-0.5">
                                                {originalPasswordOf.siteName}
                                            </span>
                                            <span className="text-xs">
                                                {originalPasswordOf.email}
                                            </span>
                                        </div>
                                    </span>
                                    PassLock recommends to generate a unique password for each account. This prevents a single breach from compromising multiple accounts.
                                </div>
                            )}
                            {active.notification === "unsecuredWebsites" && (
                                <p className="text-[13px]">
                                    It seems you&apos;ve created an account on a website that lacks proper security measures. Your safety and privacy are our top priorities, and we want to ensure that your personal information remains protected.
                                    <br />
                                    PassLock recommends reviewing the security practices of the website where you&apos;ve created an account. If you find any malicious practices, don&apos;t hesitate to delete the account from that site.
                                </p>
                            )}
                        </div>
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
                    <EverythingGood />
                )}
            </div>
        </div>
    )
};

export default WatchtowerPage;