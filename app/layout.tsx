import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CookiesProvider } from "next-client-cookies/server";

import "./globals.css";
import Providers from "@/components/providers";
import NewItemModal from "@/components/new-item-modal";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/components/analytics/provider";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "PassLock",
    description: "Your goto password manager",
    icons: {
        icon: "/logo.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <CookiesProvider>
                <CSPostHogProvider>
                    <body className={plusJakartaSans.className}>
                        <Toaster />
                        <Providers>
                            <NewItemModal />
                            {children}
                        </Providers>
                    </body>
                </CSPostHogProvider>
            </CookiesProvider>
        </html>
    );
}