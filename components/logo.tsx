import Link from "next/link";
import Image from "next/image";
import { Play } from "next/font/google";

import { cn } from "@/lib/utils";

const play = Play({
    subsets: ["latin"],
    weight: ["700"]
});

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-x-1">
            <Image
                src="/logo.png"
                alt="Logo"
                height={35}
                width={35}
            />
            <h1 className={cn(
                play.className,
                "font-bold text-xl text-slate-900"
            )}>
                PassLock
            </h1>
        </Link>
    )
};

export default Logo;