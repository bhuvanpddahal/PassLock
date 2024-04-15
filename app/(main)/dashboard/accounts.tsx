import Image from "next/image";

import { cn } from "@/lib/utils";

const Accounts = () => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] p-3 text-sm">
            <h3>All Categories</h3>
            <ul className="mt-3">
                <li className={cn(
                    "flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-black/5",
                    true && "bg-primary hover:bg-primary/90"
                )}>
                    <Image
                        src="/logo.png"
                        alt="Account"
                        height={40}
                        width={40}
                    />
                    <div>
                        <span className={cn(
                            "font-medium text-zinc-900 block -mb-0.5",
                            true && "text-zinc-100"
                        )}>Google</span>
                        <span className={cn(
                            "text-muted-foreground text-xs",
                            true && "text-zinc-100"
                        )}>abc@gmail.com</span>
                    </div>
                </li>
                <li className={cn(
                    "flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-black/5",
                    false && "bg-primary hover:bg-primary/90"
                )}>
                    <Image
                        src="/logo.png"
                        alt="Account"
                        height={40}
                        width={40}
                    />
                    <div>
                        <span className={cn(
                            "font-medium text-zinc-900 block -mb-0.5",
                            false && "text-zinc-100"
                        )}>Google</span>
                        <span className={cn(
                            "text-muted-foreground text-xs",
                            false && "text-zinc-100"
                        )}>abc@gmail.com</span>
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default Accounts;