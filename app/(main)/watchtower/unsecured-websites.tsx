import Image from "next/image";
import { ShieldOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const UnsecuredWebsites = () => {
    return (
        <div>
            <h4 className="flex items-center justify-between bg-zinc-100 px-3 py-1">
                <div className="flex items-center gap-1 text-slate-700">
                    <ShieldOff className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        Unsecured Websites
                    </div>
                </div>
                <Badge variant="destructive">3</Badge>
            </h4>
            <ul className="p-3">
                <li className="flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5">
                    <div className="relative">
                        <Image
                            src="/padlock.png"
                            alt="Account"
                            height={40}
                            width={40}
                            className="rounded-md"
                        />
                    </div>
                    <div>
                        <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                            Amazon
                        </span>
                        <span className="text-muted-foreground text-xs">
                            abc@gmail.com
                        </span>
                    </div>
                </li>
                <li className="flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5">
                    <div className="relative">
                        <Image
                            src="/padlock.png"
                            alt="Account"
                            height={40}
                            width={40}
                            className="rounded-md"
                        />
                    </div>
                    <div>
                        <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                            Amazon
                        </span>
                        <span className="text-muted-foreground text-xs">
                            abc@gmail.com
                        </span>
                    </div>
                </li>
                <li className="flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5">
                    <div className="relative">
                        <Image
                            src="/padlock.png"
                            alt="Account"
                            height={40}
                            width={40}
                            className="rounded-md"
                        />
                    </div>
                    <div>
                        <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                            Amazon
                        </span>
                        <span className="text-muted-foreground text-xs">
                            abc@gmail.com
                        </span>
                    </div>
                </li>
                <li className="flex items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer hover:bg-black/5">
                    <div className="relative">
                        <Image
                            src="/padlock.png"
                            alt="Account"
                            height={40}
                            width={40}
                            className="rounded-md"
                        />
                    </div>
                    <div>
                        <span className="text-sm text-left font-medium text-zinc-900 block -mb-0.5">
                            Amazon
                        </span>
                        <span className="text-muted-foreground text-xs">
                            abc@gmail.com
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default UnsecuredWebsites;