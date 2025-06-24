import {
    Check,
    Clock,
    Copy,
    Eye,
    EyeOff,
    ShieldAlertIcon,
    ShieldCheckIcon,
    Star
} from "lucide-react";
import { $Enums, Site } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";

import ItemImage from "./item-image";
import EditItemButton from "./edit-item-button";
import DeleteItemButton from "./delete-item-button";
import { cn } from "@/lib/utils";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import SiteSecurityDetails from "./site-security-details";
import { convertValueToTitleCase } from "@/lib/password";

interface ItemContentProps {
    id: string;
    siteName: string;
    siteLink: string;
    email: string;
    password: string;
    passwordStrength: $Enums.PasswordStrength;
    addedAt: Date;
    favoritedAt: Date | null;
    site: Site;
}

const ItemContent = ({
    id,
    siteName,
    siteLink,
    email,
    password,
    passwordStrength,
    addedAt,
    favoritedAt,
    site
}: ItemContentProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailCopied, setIsEmailCopied] = useState(false);
    const [isPasswordCopied, setIsPasswordCopied] = useState(false);
    const [isSiteLinkCopied, setIsSiteLinkCopied] = useState(false);
    const [showSiteSecurityDetails, setShowSiteSecurityDetails] = useState(false);

    const handleCopy = (
        isCopied: boolean,
        setIsCopied: Dispatch<SetStateAction<boolean>>,
        valueToBeCopied: string
    ) => {
        return async () => {
            if (isCopied) return;

            await window.navigator.clipboard.writeText(valueToBeCopied);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 3000);
        };
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex-1 p-3 pl-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">
                        Added {formatDistanceToNowStrict(addedAt)} ago
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <EditItemButton
                        id={id}
                        siteName={siteName}
                        siteLink={siteLink}
                        email={email}
                        password={password}
                        favorited={!!favoritedAt}
                    />
                    <DeleteItemButton
                        id={id}
                        siteName={siteName}
                        email={email}
                        favorited={!!favoritedAt}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 mt-4 mb-8">
                <div className="relative">
                    <ItemImage
                        key={siteLink}
                        siteName={siteName}
                        hostname={site.canonicalHostname}
                        width={90}
                        height={90}
                        className="shadow-lg"
                    />
                    {favoritedAt && (
                        <div className="absolute top-full left-full p-1 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full">
                            <Star
                                className="h-4 w-4"
                                style={{ fill: "whitesmoke", color: "#aaa" }}
                            />
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold text-zinc-800">
                    {siteName}
                </h2>
            </div>
            <div className="border border-zinc-200 rounded-lg">
                <div className="py-3 px-4 border-b border-zinc-200">
                    <div className="group flex justify-between">
                        <div>
                            <h3 className="text-[13px] text-primary -mb-0.5">Site Link</h3>
                            <div className="flex items-center gap-x-1.5">
                                <p
                                    className="text-sm text-zinc-800 font-medium cursor-pointer"
                                    onClick={() => setShowSiteSecurityDetails(!showSiteSecurityDetails)}
                                >
                                    {siteLink}
                                </p>
                                <HoverCard>
                                    <HoverCardTrigger className="p-0.5">
                                        {site.isSecured ? (
                                            <ShieldCheckIcon className="size-4 stroke-background fill-green-500" />
                                        ) : (
                                            <ShieldAlertIcon className="size-4 stroke-background fill-red-500" />
                                        )}
                                    </HoverCardTrigger>
                                    <HoverCardContent className="space-y-2">
                                        <p>
                                            {site.isSecured
                                                ? "This site is secured and adheres to industry-standard security best practices."
                                                : "This site is not secured and does not adhere to standard security best practices."
                                            }
                                        </p>
                                        {!showSiteSecurityDetails && (
                                            <p>Click the site link on the left to view additional security details.</p>
                                        )}
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="h-5 w-5 p-0 opacity-0 transition-opacity delay-1000 group-hover:opacity-100 group-hover:transition-none group-hover:delay-0"
                            onClick={handleCopy(isSiteLinkCopied, setIsSiteLinkCopied, siteLink)}
                        >
                            {isSiteLinkCopied ? (
                                <Check className="h-3 w-3 text-green-600" />
                            ) : (
                                <Copy className="h-3 w-3 text-zinc-600" />
                            )}
                        </Button>
                    </div>
                    <SiteSecurityDetails site={site} show={showSiteSecurityDetails} />
                </div>
                <div className="group py-3 px-4 flex justify-between border-b border-zinc-200">
                    <div>
                        <h3 className="text-[13px] text-primary -mb-0.5">Email</h3>
                        <p className="text-sm text-zinc-800 font-medium">{email}</p>
                    </div>
                    <Button
                        variant="outline"
                        className="h-5 w-5 p-0 opacity-0 transition-opacity delay-1000 group-hover:opacity-100 group-hover:transition-none group-hover:delay-0"
                        onClick={handleCopy(isEmailCopied, setIsEmailCopied, email)}
                    >
                        {isEmailCopied ? (
                            <Check className="h-3 w-3 text-green-600" />
                        ) : (
                            <Copy className="h-3 w-3 text-zinc-600" />
                        )}
                    </Button>
                </div>
                <div className="py-3 px-4 flex justify-between">
                    <div>
                        <h3 className="text-[13px] text-primary -mb-0.5">Password</h3>
                        <p className={cn(
                            "text-sm text-zinc-800 font-medium blur-sm select-none",
                            showPassword && "blur-none select-auto"
                        )}>
                            {password}
                        </p>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                className="h-5 w-5 p-0"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-3 w-3 text-zinc-600" />
                                ) : (
                                    <Eye className="h-3 w-3 text-zinc-600" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-5 w-5 p-0"
                                onClick={handleCopy(isPasswordCopied, setIsPasswordCopied, password)}
                            >
                                {isPasswordCopied ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                    <Copy className="h-3 w-3 text-zinc-600" />
                                )}
                            </Button>
                        </div>
                        <div className={cn(
                            "text-xs text-muted-foreground text-right font-medium",
                            passwordStrength === "TOO_WEAK" && "text-red-500",
                            passwordStrength === "WEAK" && "text-orange-500",
                            passwordStrength === "MEDIUM" && "text-blue-500",
                            passwordStrength === "STRONG" && "text-green-500"
                        )}>
                            {convertValueToTitleCase(passwordStrength)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemContent;