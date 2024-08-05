import Link from "next/link";
import {
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
} from "react-share";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-card border-t p-6 pt-4">
            <div className="max-w-[1400px] w-full flex items-center justify-between mx-auto">
                <div className="flex gap-x-2">
                    <Link href="/">
                        <FacebookIcon size={24} round />
                    </Link>
                    <Link href="/">
                        <TwitterIcon size={24} round />
                    </Link>
                    <Link href="/">
                        <WhatsappIcon size={24} round />
                    </Link>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    © {(new Date()).getFullYear()} Unmask, Inc. Privacy and Terms
                </div>
            </div>
        </footer>
    );
};

export default Footer;