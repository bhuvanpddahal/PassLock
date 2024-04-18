import ItemLoader from "./item-loader";

const ItemsLoader = () => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] flex flex-col text-sm">
            <div className="ml-6 mt-[16.5px] mb-[17px] h-[10.5px] w-[55px] bg-zinc-300 rounded-full animate-pulse" />
            <div className="h-[calc(100vh-126px)] px-3 overflow-y-auto">
                <div className="flex items-center gap-2 bg-zinc-300 p-3 rounded-lg animate-pulse">
                    <div className="bg-white h-[40px] w-[40px] rounded-md" />
                    <div className="space-y-1.5">
                        <div className="h-[11px] w-[80px] bg-white rounded-full" />
                        <div className="h-[10px] w-[140px] bg-white rounded-full" />
                    </div>
                </div>
                {Array.from({ length: 9 }, (_, index) => (
                    <ItemLoader key={index} />
                ))}
            </div>
        </div>
    )
};

export default ItemsLoader;