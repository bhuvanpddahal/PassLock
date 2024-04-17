import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CookiesProvider } from "next-client-cookies/server";

import "./globals.css";
import Providers from "@/components/providers";
import NewItemModal from "@/components/new-item-modal";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "PassLock",
    description: "Your goto password manager"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={plusJakartaSans.className}>
                <Toaster />
                <CookiesProvider>
                    <Providers>
                        <NewItemModal />
                        {children}
                    </Providers>
                </CookiesProvider>
            </body>
        </html>
    );
}