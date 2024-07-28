import Link from "next/link";

import UserAvatar from "@/components/UserAvatar";
import { ChevronRight } from "lucide-react";

const IndustryChannels = () => {
    return (
        <div className="bg-white dark:bg-card p-5 rounded-md">
            <div className="mb-2">
                <h3 className="text-sm text-zinc-500">
                    INDUSTRIES
                </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...new Array(8)].map((_, index) => (
                    <Link
                        key={index}
                        href={"/"}
                        className="group flex items-center gap-x-2 p-4 border rounded-md"
                    >
                        <UserAvatar
                            image={null}
                            username="username"
                        />
                        <div>
                            <div className="text-sm font-semibold -mb-1 group-hover:underline">
                                Autogy
                            </div>
                            <span className="text-xs text-gray-500">
                                778k Followers
                            </span>
                        </div>
                    </Link>
                ))}
                <div
                    className="flex items-center gap-x-4 p-4 border rounded-md cursor-pointer hover:bg-slate-100"
                >
                    <ChevronRight className="size-10 p-1 bg-primary text-primary-foreground rounded-full" />
                    <p className="text-sm font-medium">Load more channels</p>
                </div>
            </ul>
        </div>
    )
};

export default IndustryChannels;