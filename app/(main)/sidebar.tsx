"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

import NavLinks from "./nav-links";
import Logo from "@/components/logo";
import UserAccountNav from "./user-account-nav";

const Sidebar = () => {
    const router = useRouter();
    const cookies = useCookies();

    return (
        <aside className="w-full sm:w-[270px] h-full bg-slate-800 flex flex-col">
            <div className="p-6 border-b border-zinc-600">
                <Logo
                    href="/dashboard"
                    className="text-zinc-100"
                    size="small"
                />
            </div>

            <UserAccountNav />

            <NavLinks />

            <div className="border-t border-zinc-600 text-sm text-zinc-100 p-3 flex items-center justify-between transition-colors hover:bg-white/10" onClick={() => {
                cookies.remove("user");
                router.refresh();
            }}>
                Sign Out
                <ArrowRight className="h-4 w-4" />
            </div>
        </aside>
    )
};

export default Sidebar;