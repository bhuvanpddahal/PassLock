import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ItemImageProps {
    siteName: string;
    siteLink: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    className?: string;
}

const ItemImage = ({
    siteName,
    siteLink,
    width = 40,
    height = 40,
    className = ""
}: ItemImageProps) => {
    const encodedSiteLink = encodeURIComponent(siteLink);
    const faviconProxyUrl = `/api/favicon?siteLink=${encodedSiteLink}`;
    const [isError, setIsError] = useState(false);

    return (
        <Image
            src={isError ? "/padlock.png" : faviconProxyUrl}
            alt={`Favicon for ${siteName}`}
            width={width}
            height={height}
            blurDataURL="/padlock.png"
            className={cn("rounded-md", className)}
            onError={() => setIsError(true)}
            unoptimized
        />
    );
};

export default ItemImage;