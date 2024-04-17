const ItemLoader = () => {
    return (
        <div className="flex items-center gap-2 p-3">
            <div className="bg-zinc-300 h-[40px] w-[40px] rounded-md animate-pulse" />
            <div className="space-y-1.5">
                <div className="h-[11px] w-[80px] bg-zinc-300 animate-pulse rounded-full" />
                <div className="h-[10px] w-[140px] bg-zinc-300 animate-pulse rounded-full" />
            </div>
        </div>
    )
};

export default ItemLoader;