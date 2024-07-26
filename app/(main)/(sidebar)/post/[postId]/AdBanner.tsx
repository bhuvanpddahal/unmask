import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const AdBanner = () => {
    const router = useRouter();

    return (
        <div
            className="bg-primary flex gap-4 p-6 mt-6 rounded-sm cursor-pointer hover:opacity-90"
            onClick={() => router.push("https://rave-hq.vercel.app")}
        >
            <Image
                src="https://rave-hq.vercel.app/logo-icon.png"
                alt="RaveHQ Logo"
                width={40}
                height={11}
                className="h-[40px] w-auto"
            />
            <p className="text-xl text-primary-foreground font-semibold">
                Grow Trust & Credibility with Authentic Testimonials using RaveHQ
            </p>
            <Button className="min-w-fit bg-white dark:bg-zinc-700 self-center text-primary dark:text-white transition-opacity hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Open
            </Button>
        </div>
    )
};

export default AdBanner;

export const AdBannerLoader = () => (
    <Skeleton className="h-[104px] w-full rounded-sm mt-6" />
);