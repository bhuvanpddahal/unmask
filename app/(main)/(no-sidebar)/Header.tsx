interface HeaderProps {
    title: string;
    description: string;
}

const Header = ({
    title,
    description
}: HeaderProps) => {
    return (
        <header className="mb-4">
            <h1 className="text-xl font-bold text-foreground">
                {title}
            </h1>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
                {description}
            </p>
        </header>
    )
};

export default Header;