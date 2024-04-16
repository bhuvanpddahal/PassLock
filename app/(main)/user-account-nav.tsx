"use client";

import Link from "next/link";
import {
    ChevronDown,
    LogOut,
    UserRound,
    Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

import {
    Avatar,
    AvatarFallback
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserAccountNav = () => {
    const router = useRouter();
    const cookies = useCookies();
    const userString = cookies.get("user");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!userString || !isMounted) return null;

    const user = JSON.parse(userString);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-none border-none">
                <div className="p-3 rounded-sm flex items-center justify-between transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-orange-600 to-red-600 text-lg text-zinc-100">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-zinc-100 text-sm">
                            {user.name}
                        </div>
                    </div>
                    <ChevronDown className="text-zinc-100 h-5 w-5" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white w-[calc(100vw-10px)] sm:w-[260px] z-[100]' align="center">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className='font-medium text-[15px]'>{user.name}</p>}
                        {user.email && <p className='font-medium w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/users/${user.id}`} className='flex items-center gap-2'>
                        <UserRound className='h-4 w-4 text-zinc-600' />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/favorites" className='flex items-center gap-2'>
                        <Star className='h-4 w-4 text-zinc-600' />
                        Favorites
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    cookies.remove("user");
                    router.refresh();
                }} className='cursor-pointer flex items-center gap-2'>
                    <LogOut className='h-4 w-4 text-zinc-600' />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserAccountNav;