import Link from "next/link";
import Image from "next/image";
import { Exo_2 } from "next/font/google";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "default" | "small";
}

const exo2 = Exo_2({
    subsets: ["latin"],
    weight: ["700"]
});

const Logo = ({
    className,
    size = "default"
}: LogoProps) => {
    return (
        <Link href="/" className="w-fit flex items-center gap-x-1">
            <Image
                src="/logo.png"
                alt="Logo"
                height={size === "default" ? 35 : 25}
                width={size === "default" ? 35 : 25}
            />
            <h1 className={cn(
                exo2.className,
                "font-bold text-xl text-slate-900",
                className,
                size === "small" && "text-sm"
            )}>
                PassLock
            </h1>
        </Link>
    )
};

export default Logo;