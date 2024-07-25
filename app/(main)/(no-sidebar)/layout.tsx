import Footer from "./Footer";

interface NoSidebarLayoutProps {
    children: React.ReactNode;
}

const NoSidebarLayout = ({ children }: NoSidebarLayoutProps) => {
    return (
        <>
            <div className="max-w-6xl w-full min-h-[calc(100vh-60px)] mx-auto p-6">
                {children}
            </div>
            <Footer />
        </>
    )
};

export default NoSidebarLayout;