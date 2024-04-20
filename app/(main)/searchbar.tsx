import { Search } from "lucide-react";
import { KeyboardEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

const Searchbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [input, setInput] = useState(query);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            router.push(`/search?query=${input}`);
        }
    };

    useEffect(() => {
        if (!pathname.includes("/search")) {
            setInput("");
        }
    }, [pathname]);

    return (
        <div className="relative max-w-lg z-50 w-full">
            <Search className="h-4 w-4 absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
                className="pl-8 w-full rounded-lg border ring-zinc-700 focus-visible:ring-1 focus-visible:ring-offset-0"
                placeholder="Search in PassLock..."
                value={input}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                    setInput(e.target.value);
                }}
            />
        </div>
    )
};

export default Searchbar;