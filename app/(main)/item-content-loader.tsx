const ItemContentLoader = () => {
    return (
        <div className="flex-1 p-3 pl-4">
            <div className="flex items-center justify-end gap-2">
                <div className="h-9 rounded-md w-[71px] bg-zinc-300 animate-pulse" />
                <div className="h-9 rounded-md w-[44px] bg-zinc-300 animate-pulse" />
            </div>
            <div className="flex items-center gap-3 mt-4 mb-8">
                <div className="h-[90px] w-[90px] rounded-md bg-zinc-300 animate-pulse" />
                <div className="h-[16px] w-[100px] bg-zinc-300 animate-pulse rounded-full" />
            </div>
            <div className="border border-zinc-200 rounded-lg">
                <div className="h-[61.5px] py-3 px-4 border-b border-zinc-200">
                    <h3 className="text-[13px] text-primary -mb-0.5">Site Link</h3>
                    <div className="h-[10px] w-[150px] bg-zinc-300 my-2 animate-pulse rounded-full" />
                </div>
                <div className="h-[61.5px] py-3 px-4 border-b border-zinc-200">
                    <h3 className="text-[13px] text-primary -mb-0.5">Email</h3>
                    <div className="h-[10px] w-[130px] bg-zinc-300 my-2 animate-pulse rounded-full" />
                </div>
                <div className="h-[62px] py-3 px-4 flex justify-between">
                    <div>
                        <h3 className="text-[13px] text-primary -mb-0.5">Password</h3>
                        <div className="h-[10px] w-[105px] bg-zinc-300 my-2 animate-pulse rounded-full" />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-end gap-2">
                            <div className="h-[19px] w-[19px] bg-zinc-300 rounded-md animate-pulse" />
                            <div className="h-[19px] w-[19px] bg-zinc-300 rounded-md animate-pulse" />
                        </div>
                        <div className="ml-auto h-[10px] w-[40px] bg-zinc-300 animate-pulse rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ItemContentLoader;