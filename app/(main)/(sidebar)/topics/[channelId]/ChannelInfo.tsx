import Image from "next/image";
import { Visibility } from "@prisma/client";
import { Dot, Globe, GlobeLock } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface ChannelInfoProps {
    channelName: string;
    channelDescription: string | null;
    bannerImage: string | null;
    profileImage: string | null;
    visibility: Visibility;
    followsCount: number;
    isFollowed: boolean;
}

const ChannelInfo = ({
    channelName,
    channelDescription,
    bannerImage,
    profileImage,
    visibility,
    followsCount,
    isFollowed
}: ChannelInfoProps) => {
    return (
        <Card className="relative">
            <div className="relative h-[120px] sm:h-[180px] md:h-[200px] rounded-t-md bg-gray-200 dark:bg-gray-800">
                <Image
                    src={bannerImage || "/channel-banner.jpg"}
                    alt="Channel Banner"
                    fill
                    className="object-cover rounded-t-md"
                />
            </div>
            <div className="absolute w-full top-[120px] sm:top-[180px] md:top-[200px] -translate-y-[35%] flex items-end justify-between px-4">
                <div className="relative h-[72px] w-[72px] border-[3px] border-card bg-gray-400 dark:bg-gray-600 rounded-full">
                    <Image
                        src={profileImage || "/channel-profile.png"}
                        alt="Channel Profile"
                        fill
                        sizes="66px"
                        className="object-cover rounded-full"
                    />
                </div>
                <Button
                    variant="outline"
                    className="rounded-full"
                >
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button>
            </div>
            <div className="px-4 pt-[55px] pb-6">
                <h1 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                    {channelName}
                </h1>
                {channelDescription && (
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {channelDescription}
                    </p>
                )}
                <div className="flex items-center gap-x-1 text-zinc-600 dark:text-zinc-400 mt-2">
                    {visibility === "private" ? (
                        <GlobeLock className="size-4" />
                    ) : (
                        <Globe className="size-4" />
                    )}
                    <div className="flex items-center text-sm capitalize">
                        {visibility}
                        <Dot className="size-3 mt-1" />
                        {followsCount} {followsCount === 1 ? "Follower" : "Followers"}
                    </div>
                </div>
            </div>
        </Card>
    )
};

export default ChannelInfo;

export const ChannelInfoLoader = () => (
    <Card className="relative">
        <Skeleton className="h-[120px] sm:h-[180px] md:h-[200px] rounded-b-none" />
        <div className="absolute w-full top-[120px] sm:top-[180px] md:top-[200px] -translate-y-[35%] flex items-end justify-between px-4">
            <div className="bg-card rounded-full">
                <Skeleton className="h-[72px] w-[72px] border-[3px] border-card rounded-full" />
            </div>
            <Skeleton className="h-9 w-[75px] rounded-full" />
        </div>
        <div className="px-4 pt-[55px] pb-6">
            <Skeleton className="h-5 w-[150px] mt-1" />
            <div className="flex items-center gap-x-1 text-zinc-600 mt-3">
                <Skeleton className="size-4 rounded-full" />
                <div className="flex items-center py-[3px]">
                    <Skeleton className="h-3.5 w-[41px]" />
                    <Dot className="size-3 mt-1" />
                    <Skeleton className="h-3.5 w-[100px]" />
                </div>
            </div>
        </div>
    </Card>
);