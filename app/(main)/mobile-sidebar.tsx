import { Menu } from "lucide-react";

import Sidebar from "./sidebar";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="px-2 py-1.5 hover:bg-primary/10 rounded-sm">
                <Menu className="text-zinc-900 h-6 w-6" />
            </SheetTrigger>
            <SheetContent className="w-full sm:w-fit p-0 z-[50] border-0 sm:border-r sm:border-zinc-600" side="left">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
};

export default MobileSidebar;