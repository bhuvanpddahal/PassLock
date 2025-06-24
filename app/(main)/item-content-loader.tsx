import { Skeleton } from "@/components/ui/skeleton";

const ItemContentLoader = () => {
    return (
        <div className="flex-1 p-3 pl-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-[10px] w-[108px]" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 rounded-md w-[71px]" />
                    <Skeleton className="h-9 rounded-md w-[44px]" />
                </div>
            </div>
            <div className="flex items-center gap-3 mt-4 mb-8">
                <Skeleton className="h-[90px] w-[90px] rounded-md" />
                <Skeleton className="h-[16px] w-[100px]" />
            </div>
            <div className="border border-zinc-200 rounded-lg">
                <div className="h-[61.5px] py-3 px-4 border-b border-zinc-200">
                    <h3 className="text-[13px] text-primary -mb-0.5">Site Link</h3>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="h-[10px] w-[150px] my-2" />
                        <Skeleton className="size-4 rounded-full" />
                    </div>
                </div>
                <div className="h-[61.5px] py-3 px-4 border-b border-zinc-200">
                    <h3 className="text-[13px] text-primary -mb-0.5">Email</h3>
                    <Skeleton className="h-[10px] w-[130px] my-2" />
                </div>
                <div className="h-[62px] py-3 px-4 flex justify-between">
                    <div>
                        <h3 className="text-[13px] text-primary -mb-0.5">Password</h3>
                        <Skeleton className="h-[10px] w-[105px] my-2" />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-[19px] w-[19px] rounded-md" />
                            <Skeleton className="h-[19px] w-[19px] rounded-md" />
                        </div>
                        <Skeleton className="ml-auto h-[10px] w-[40px]" />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ItemContentLoader;