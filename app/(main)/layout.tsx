import Navbar from "./Navbar";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <main>
            <Navbar />
            {children}
        </main>
    )
};

export default MainLayout;