"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ChannelType } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/hooks/useToast";
import { CHANNELS_PER_PAGE } from "@/constants";
import { Skeleton } from "@/components/ui/Skeleton";
import { getTopicChannels } from "@/actions/channel";
import Image from "next/image";

interface TopicChannelsProps {
    type: ChannelType;
}

interface FetchTopicChannelsParams {
    pageParam: number;
}

interface ChannelsData {
    channels: {
        id: string;
        name: string;
        profileImage: string | null;
        _count: {
            follows: number;
        };
    }[];
    hasNextPage: boolean;
}

const TopicChannels = ({
    type
}: TopicChannelsProps) => {
    const { toast } = useToast();
    const { ref, inView } = useInView();

    const fetchTopicChannels = async ({ pageParam }: FetchTopicChannelsParams) => {
        const payload = { channelType: type, page: pageParam, limit: CHANNELS_PER_PAGE };
        const data = await getTopicChannels(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch channels",
                description: data.error
            });
            return { channels: [], hasNextPage: false };
        }
        return data as ChannelsData;
    };

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["topics", { type }],
        queryFn: fetchTopicChannels,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasNextPage) {
                return pages.length + 1;
            } else {
                return null;
            }
        }
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const channels = data?.pages.flatMap((page) => page.channels);

    if (isLoading) return <TopicChannelsLoader />
    if (!channels) return <div className="text-center text-sm text-destructive font-medium py-3">❌ Error: No channels</div>

    return (
        <>
            {channels.length ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {channels.map((channel, index) => (
                        <Link
                            key={channel.id}
                            ref={index === channels.length - 1 ? ref : undefined}
                            href={`/topics/${channel.id}`}
                            className="group flex items-center gap-x-2 p-4 border rounded-md"
                        >
                            <UserAvatar
                                image={channel.profileImage || "/channel-profile.png"}
                                username=""
                            />
                            <div>
                                <div className="text-sm font-semibold -mb-1 group-hover:underline">
                                    {channel.name}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {channel._count.follows} {channel._count.follows === 1 ? "Follower" : "Followers"}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {hasNextPage && (
                        isFetchingNextPage ? (
                            Array.from({ length: 3 }, (_, index) => (
                                <TopicChannelLoader key={index} />
                            ))
                        ) : (
                            <div
                                className="flex items-center gap-x-4 p-4 border rounded-md cursor-pointer hover:bg-slate-100"
                                onClick={() => fetchNextPage()}
                            >
                                <ChevronRight className="size-10 p-1 bg-primary text-primary-foreground rounded-full" />
                                <p className="text-sm font-medium">Load more channels</p>
                            </div>
                        )
                    )}
                </ul>
            ) : (
                <div className="py-5 flex flex-col items-center justify-center">
                    <Image
                        src="/empty.svg"
                        alt="Empty"
                        height={80}
                        width={80}
                    />
                    <p className="text-sm font-medium text-zinc-400">
                        No channels on this topic
                    </p>
                </div>
            )}
        </>
    );
};

export default TopicChannels;

const TopicChannelLoader = () => (
    <div className="flex items-center gap-x-2 p-4 border rounded-md">
        <Skeleton className="size-10 rounded-full" />
        <div className="pt-[3px] pb-0.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-[120px] mt-[5px]" />
        </div>
    </div>
);

export const TopicChannelsLoader = () => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
            <TopicChannelLoader key={index} />
        ))}
    </ul>
);