import Sidebar from "./sidebar";
import Logo from "@/components/logo";
import MobileSidebar from "./mobile-sidebar";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({
    children
}: MainLayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <div className="h-screen sticky top-0 hidden lg:block">
                <Sidebar />
            </div>
            <main className="flex-1">
                <header className="w-full border-b border-zinc-300 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <MobileSidebar />
                        <Logo
                            className="hidden md:block"
                            size="small"
                        />
                    </div>
                    <Button>
                        New Item
                    </Button>
                </header>
                {children}
            </main>
        </div>
    )
};

export default MainLayout;