import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/Button";

const AdBanner = () => {
    const url = "https://rave-hq.vercel.app";

    return (
        <Link
            href={url}
            target="_blank"
            className="bg-primary hidden sm:flex gap-4 p-4 sm:p-6 mt-6 rounded-sm cursor-pointer hover:opacity-90"
        >
            <Image
                src={`${url}/logo-icon.png`}
                alt="RaveHQ Logo"
                width={40}
                height={11}
                className="h-[40px] w-fit"
            />
            <div className="flex-1 flex justify-between gap-4">
                <p className="text-lg sm:text-xl text-primary-foreground font-semibold">
                    Grow Trust & Credibility with Authentic Testimonials using RaveHQ
                </p>
                <Button className="min-w-fit bg-white dark:bg-card text-primary dark:text-white transition-opacity hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    Open
                </Button>
            </div>
        </Link>
    );
};

export default AdBanner;