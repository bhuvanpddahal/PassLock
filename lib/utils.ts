import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getCanonicalHostname(hostname: string) {
    const canonicalHostname = hostname.toLowerCase()
        .replace(/\/+$/, "")
        .replace("www.", "");
    return canonicalHostname;
}