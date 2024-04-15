import Header from "./header";
import Sidebar from "./sidebar";

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
            <main className="flex-1 flex flex-col">
                <Header />
                {children}
            </main>
        </div>
    )
};

export default MainLayout;