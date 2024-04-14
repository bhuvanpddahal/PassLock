import Link from "next/link";
import {
    LayoutGrid,
    Star,
    TowerControl
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NavLinks = () => {
    const pathname = usePathname();

    return (
        <ul className="flex-1 text-zinc-100 text-sm px-3 py-5">
            <li className={cn(
                "rounded-sm cursor-pointer",
                pathname === "/dashboard" ? "bg-primary/30 hover:hover:bg-primary/25" : "hover:bg-white/10"
            )}>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-x-2 p-3"
                >
                    <LayoutGrid className="h-5 w-5" />
                    All Items
                </Link>
            </li>
            <li className={cn(
                "rounded-sm cursor-pointer",
                pathname === "/favorites" ? "bg-primary/30 hover:hover:bg-primary/25" : "hover:bg-white/10"
            )}>
                <Link
                    href="/favorites"
                    className="flex items-center gap-x-2 p-3"
                >
                    <Star className="h-5 w-5" />
                    Favorites
                </Link>
            </li>
            <li className={cn(
                "rounded-sm cursor-pointer",
                pathname === "/watchtower" ? "bg-primary/30 hover:hover:bg-primary/25" : "hover:bg-white/10"
            )}>
                <Link
                    href="/watchtower"
                    className="flex items-center gap-x-2 p-3"
                >
                    <TowerControl className="h-5 w-5" />
                    Watchtower
                </Link>
            </li>
        </ul>
    )
};

export default NavLinks;