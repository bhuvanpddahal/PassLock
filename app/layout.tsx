import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PassLock",
    description: "Your goto password manager",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={plusJakartaSans.className}>
                <CookiesProvider>
                    {children}
                </CookiesProvider>
            </body>
        </html>
    );
}