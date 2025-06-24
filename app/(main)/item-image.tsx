import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ItemImageProps {
    siteName: string;
    hostname: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    className?: string;
}

const ItemImage = ({
    siteName,
    hostname,
    width = 40,
    height = 40,
    className = ""
}: ItemImageProps) => {
    const encodedHostname = encodeURIComponent(hostname);
    const faviconProxyUrl = `/api/favicon?hostname=${encodedHostname}`;
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