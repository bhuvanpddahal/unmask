interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex">
            <div className="w-[40%] bg-black hidden lg:block">

            </div>
            <div className="flex-1 bg-background flex items-center justify-center p-6">
                <div className="max-w-sm w-full">
                    {children}
                </div>
            </div>
        </div>
    )
};

export default AuthLayout;