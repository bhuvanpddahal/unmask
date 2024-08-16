import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-card border-t p-6 pt-4">
            <div className="max-w-[1400px] w-full flex items-center justify-between mx-auto">
                <Link href="https://github.com/BhuvanPdDahal/unmask" target="_blank">
                    <FaGithub className="size-6" />
                </Link>
                <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    © {(new Date()).getFullYear()} Unmask, Inc. Privacy and Terms
                </div>
            </div>
        </footer>
    );
};

export default Footer;