import Image from "next/image";
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Pencil,
    Star,
    Trash2
} from "lucide-react";
import { useState } from "react";
import { passwordStrength } from "check-password-strength";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ItemContentProps {
    siteName: string;
    siteLink: string;
    siteIcon: string | null;
    email: string;
    password: string;
    favorited: boolean;
}

const ItemContent = ({
    siteName,
    siteLink,
    siteIcon,
    email,
    password,
    favorited
}: ItemContentProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;

        window.navigator.clipboard.writeText(password);
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 3000);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex-1 p-3 pl-4">
            <div className="flex items-center justify-end gap-2">
                <Button
                    variant="ghost"
                    className="gap-1"
                    size="sm"
                >
                    <Pencil className="h-4 w-4 text-zinc-600" />
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    className="gap-1"
                    size="sm"
                >
                    <Trash2 className="h-5 w-5 text-zinc-100" />
                </Button>
            </div>
            <div className="flex items-center gap-3 mt-4 mb-8">
                <div className="relative">
                    <Image
                        src={siteIcon ? siteIcon : "/padlock.png"}
                        alt="Account"
                        height={90}
                        width={90}
                        className="rounded-md"
                    />
                    {favorited && (
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
                    <h3 className="text-[13px] text-primary -mb-0.5">Site Link</h3>
                    <p className="text-sm text-zinc-800 font-medium">{siteLink}</p>
                </div>
                <div className="py-3 px-4 border-b border-zinc-200">
                    <h3 className="text-[13px] text-primary -mb-0.5">Email</h3>
                    <p className="text-sm text-zinc-800 font-medium">{email}</p>
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
                                onClick={handleCopy}
                            >
                                {isCopied ? (
                                    <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                    <Copy className="h-3 w-3 text-zinc-600" />
                                )}
                            </Button>
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
                        </div>
                        <div className={cn(
                            "text-xs text-muted-foreground text-right",
                            passwordStrength(password).id === 0 && "text-red-500",
                            passwordStrength(password).id === 1 && "text-orange-500",
                            passwordStrength(password).id === 2 && "text-yellow-700",
                            passwordStrength(password).id === 3 && "text-green-500"
                        )}>
                            {passwordStrength(password).value}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ItemContent;