import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import { DM_Mono, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import NewItemModal from "@/components/new-item-modal";
import { Toaster } from "@/components/ui/sonner";
import { CSPostHogProvider } from "@/components/analytics/provider";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"]
});

const martianMono = DM_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-martian-mono"
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    return (
        <html lang="en">
            <head>
                <script
                    defer
                    data-website-id={process.env.METRIK_WEBSITE_ID}
                    data-domain={new URL(appUrl).host}
                    src="https://metrik-one.vercel.app/js/script.js"
                ></script>
            </head>
            <CookiesProvider>
                <CSPostHogProvider>
                    <body className={`${plusJakartaSans.className} ${martianMono.variable} antialiased`}>
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
