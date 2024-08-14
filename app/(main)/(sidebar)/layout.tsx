import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

interface SidebarLayoutProps {
    children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    return (
        <div className="max-w-[1400px] w-full mx-auto flex">
            <Sidebar />
            {children}
            <RightPanel />
        </div>
    );
};

export default SidebarLayout;