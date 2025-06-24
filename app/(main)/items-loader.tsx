import ItemLoader from "./item-loader";
import { ScrollArea } from "@/components/ui/scroll-area";

const ItemsLoader = () => {
    return (
        <div className="border-r border-zinc-300 h-full w-[280px] flex flex-col text-sm">
            <div className="ml-6 mt-[16.5px] mb-[17px] h-[10.5px] w-[55px] bg-zinc-300 rounded-full animate-pulse" />
            <ScrollArea className="h-[calc(100vh-160px)] px-3">
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
            </ScrollArea>
            <p className="text-muted-foreground text-[0.6875rem] mt-3.5 text-center">
                Your passwords are encrypted before storing.
            </p>
        </div>
    )
};

export default ItemsLoader;