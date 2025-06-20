import { Skeleton } from "@/components/ui/skeleton";

const UserAccountNavLoader = () => {
    return (
        <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 bg-zinc-500 rounded-full" />
                <Skeleton className="h-[10.5px] bg-zinc-500 w-[75px] rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 bg-zinc-500 rounded-full" />
        </div>
    )
};

export default UserAccountNavLoader;