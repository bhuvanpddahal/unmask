const DashboardPage = () => {
    return (
        <div className="h-screen w-screen bg-muted flex items-center justify-center">
            <p className="text-center max-w-sm w-full">
                This is the protected page that is only available to the authenticated users.
            </p>
        </div>
    )
};

export default DashboardPage;