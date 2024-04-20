"use client";

import { useSearchParams } from "next/navigation";

import Searchbar from "./searchbar";
import Logo from "@/components/logo";
import MobileSidebar from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import { useNewItem } from "@/hooks/use-new-item-modal";

const Header = () => {
    const { open } = useNewItem();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    return (
        <header className="sticky top-0 z-20 bg-white w-full border-b border-zinc-300 p-3 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
                <MobileSidebar />
                <Logo
                    className="hidden md:block"
                    size="small"
                />
            </div>
            <div className="hidden lg:block" />
            <Searchbar
                query={query}
            />
            <Button onClick={open}>
                New Item
            </Button>
        </header>
    )
};

export default Header;