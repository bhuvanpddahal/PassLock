import { CircleAlert, Star } from "lucide-react";

import ItemImage from "../item-image";
import type { Data } from "./content";
import type { ItemWithReusedPassword } from "@/lib/queries/item";

interface WarningBannerProps {
    activeNotification: keyof Data;
    originalPasswordOf: ItemWithReusedPassword["originalPasswordOf"];
}

const WarningBanner = ({
    activeNotification,
    originalPasswordOf
}: WarningBannerProps) => {
    return (
        <div className="m-3 bg-destructive/15 text-destructive rounded-md p-3 flex gap-3">
            <CircleAlert className="h-5 w-5 shrink-0" />
            {activeNotification === "vulnerablePasswords" && (
                <p className="text-[13px] font-medium">
                    It seems like your password is not strong enough to protect your account effectively. Strong passwords are crucial for keeping your personal information secure.
                    <br /><br />
                    PassLock recommends to create a new password with a mix of uppercase letters, lowercase letters, numbers, and special characters and stay away from easily guessable phrases, such as &quot;password123&quot; or &quot;qwerty&quot;.
                </p>
            )}
            {activeNotification === "reusedPasswords" && (
                <div className="text-[13px] font-medium">
                    It appears that you&apos;ve used this password for multiple accounts. Reusing passwords across different platforms significantly increases the risk of your accounts being compromised. This password was originally used in the following account:
                    <div className="flex items-center gap-2 px-3 my-5">
                        <div className="relative">
                            <ItemImage
                                siteName={originalPasswordOf.siteName}
                                siteLink={originalPasswordOf.siteLink}
                            />
                            {originalPasswordOf.favoritedAt && (
                                <div className="absolute top-full left-full p-0.5 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full">
                                    <Star
                                        className="h-3 w-3"
                                        style={{ fill: "whitesmoke", color: "#aaa" }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="text-zinc-800">
                            <span className="font-medium text-left block -mb-0.5">
                                {originalPasswordOf.siteName}
                            </span>
                            <span className="text-xs font-normal">
                                {originalPasswordOf.email}
                            </span>
                        </div>
                    </div>
                    PassLock recommends to generate a unique password for each account. This prevents a single breach from compromising multiple accounts.
                </div>
            )}
            {activeNotification === "unsecuredWebsites" && (
                <p className="text-[13px] font-medium">
                    It seems you&apos;ve created an account on a website that lacks proper security measures. Your safety and privacy are our top priorities, and we want to ensure that your personal information remains protected.
                    <br /><br />
                    PassLock recommends reviewing the security practices of the website where you&apos;ve created an account. If you find any malicious practices, don&apos;t hesitate to delete the account from that site.
                </p>
            )}
        </div>
    );
};

export default WarningBanner;