import { LucideIcon } from "lucide-react";

import ItemLoader from "../item-loader";

interface NotificationsLoaderProps {
    title: string;
    Icon: LucideIcon;
    hasActiveItem?: boolean;
}

const NotificationsLoader = ({
    title,
    Icon,
    hasActiveItem = false
}: NotificationsLoaderProps) => {
    const length = hasActiveItem ? 2 : 3;

    return (
        <div>
            <div className="flex items-center justify-between bg-zinc-100 px-3 py-1">
                <div className="flex items-center gap-1 text-slate-700">
                    <Icon className="h-4 w-4" />
                    <div className="text-[13px] font-semibold">
                        {title}
                    </div>
                </div>
                <div className="w-[29px] h-[22px] bg-zinc-300 animate-pulse rounded-full" />
            </div>
            <div className="p-3">
                {hasActiveItem && (
                    <div className="flex items-center gap-2 bg-zinc-300 p-3 rounded-lg animate-pulse">
                        <div className="bg-white h-[40px] w-[40px] rounded-md" />
                        <div className="space-y-1.5">
                            <div className="h-[11px] w-[80px] bg-white rounded-full" />
                            <div className="h-[10px] w-[140px] bg-white rounded-full" />
                        </div>
                    </div>
                )}
                {Array.from({ length }, (_, index) => (
                    <ItemLoader key={index} />
                ))}
            </div>
        </div>
    )
};

export default NotificationsLoader;