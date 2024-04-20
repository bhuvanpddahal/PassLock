import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

import { Input } from "@/components/ui/input";

interface SearchbarProps {
    query: string;
}

const Searchbar = ({
    query
}: SearchbarProps) => {
    const router = useRouter();
    const [input, setInput] = useState(query);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            router.push(`/search?query=${input}`);
        }
    };

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