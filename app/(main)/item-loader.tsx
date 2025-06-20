import { Skeleton } from "@/components/ui/skeleton";

const ItemLoader = () => {
    return (
        <div className="flex items-center gap-2 p-3">
            <Skeleton className="h-[40px] w-[40px]" />
            <div className="space-y-1.5">
                <Skeleton className="h-[11px] w-[80px] rounded-full" />
                <Skeleton className="h-[10px] w-[140px] rounded-full" />
            </div>
        </div>
    )
};

export default ItemLoader;