"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
    const router = useRouter();
    const cookies = useCookies();
    const userString = cookies.get("user");

    return (
        <nav className="bg-white">
            <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
                <Logo />
                <div className="h-full flex items-center gap-5">
                    {userString ? (
                        <div
                            className="group relative sm:text-[17px] font-medium transition-colors cursor-pointer hover:text-primary"
                            onClick={() => {
                                cookies.remove("user");
                                router.refresh();
                            }}
                        >
                            Sign out
                            <span className="absolute bg-primary h-[2px] w-0 left-0 -bottom-1.5 transition-all group-hover:w-full" />
                        </div>
                    ) : (
                        <Link
                            href="/signin"
                            className="group relative sm:text-[17px] font-medium transition-colors hover:text-primary"
                        >
                            Sign in
                            <span className="absolute bg-primary h-[2px] w-0 left-0 -bottom-1.5 transition-all group-hover:w-full" />
                        </Link>
                    )}
                    <Separator
                        orientation="vertical"
                        className="bg-zinc-300 h-[30px]"
                    />
                    {userString ? (
                        <Link
                            href="/dashboard"
                            className="sm:text-[17px] px-4 py-2 border-2 border-primary bg-primary font-bold text-zinc-100 rounded-full transition-colors hover:bg-transparent hover:text-primary"
                        >
                            My Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/signup"
                            className="sm:text-[17px] px-4 py-2 border-2 border-primary bg-primary font-bold text-zinc-100 rounded-full transition-colors hover:bg-transparent hover:text-primary"
                        >
                            Try PassLock Free
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;