"use client";

import { useState } from "react";

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";

const Searchbar = () => {
    const [input, setInput] = useState("");

    return (
        <Command className="relative rounded-lg border max-w-lg z-40 overflow-visible">
            <CommandInput
                className="h-10 outline-none border-none focus:border-none focus:outline-none ring-0"
                placeholder="Search in PassLock..."
                value={input}
                onValueChange={(text) => {
                    // setInput(text);
                }}
            />
        </Command>
    )
};

export default Searchbar;