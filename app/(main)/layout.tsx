import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <main>
            <Navbar />
            <div className="flex">
                <Sidebar />
                {children}
                <RightPanel />
            </div>
        </main>
    )
};

export default MainLayout;