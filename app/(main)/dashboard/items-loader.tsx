const ItemsLoader = () => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] flex flex-col p-3 text-sm">
            <div className="ml-3 my-[5px] h-[10.5px] w-[55px] bg-zinc-300 rounded-full animate-pulse" />
            <div className="h-[calc(100vh-126px)] mt-3 overflow-y-auto">
                <div className="flex items-center gap-2 bg-zinc-300 p-3 rounded-lg animate-pulse">
                    <div className="bg-white h-[40px] w-[40px] rounded-md" />
                    <div className="space-y-1.5">
                        <div className="h-[11px] w-[80px] bg-white rounded-full" />
                        <div className="h-[10px] w-[140px] bg-white rounded-full" />
                    </div>
                </div>
                {Array.from({ length: 9 }, (_, index) => (
                    <div key={index} className="flex items-center gap-2 p-3">
                        <div className="bg-zinc-300 h-[40px] w-[40px] rounded-md animate-pulse" />
                        <div className="space-y-1.5">
                            <div className="h-[11px] w-[80px] bg-zinc-300 animate-pulse rounded-full" />
                            <div className="h-[10px] w-[140px] bg-zinc-300 animate-pulse rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ItemsLoader;