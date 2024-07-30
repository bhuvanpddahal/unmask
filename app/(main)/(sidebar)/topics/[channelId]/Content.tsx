"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import Posts, { PostsLoader } from "./Posts";
import AdBanner, { AdBannerLoader } from "../../AdBanner";
import ChannelInfo, { ChannelInfoLoader } from "./ChannelInfo";
import { getChannelInfo } from "@/actions/channel";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ChannelDetailsContentProps {
    channelId: string;
}

const ChannelDetailsContent = ({
    channelId
}: ChannelDetailsContentProps) => {
    const user = useCurrentUser();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "recent";

    const {
        data,
        isLoading
    } = useQuery({
        queryKey: ["topics", channelId],
        queryFn: async () => {
            const payload = { channelId };
            const data = await getChannelInfo(payload);
            return data;
        }
    });

    if (isLoading) return (
        <div className="space-y-4">
            <ChannelInfoLoader />
            <AdBannerLoader />
            <PostsLoader sort={sort} />
        </div>
    )
    if (!data || data.error) return (
        <div className="py-20 flex flex-col items-center justify-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <p className="text-sm font-medium text-zinc-400">
                {data?.error || "Something went wrong"}
            </p>
        </div>
    )

    const isFollowed = data.channel?.follows[0] && data.channel.follows[0].followerId === user?.id;

    return (
        <div className="space-y-4">
            <ChannelInfo
                channelName={data.channel?.name || ""}
                channelDescription={data.channel?.description || ""}
                bannerImage={null}
                profileImage={null}
                visibility={data.channel?.visibility || "public"}
                followsCount={data.channel?._count.follows || 0}
                isFollowed={!!isFollowed}
            />
            <AdBanner />
            <Posts
                channelId={channelId}
                sort={sort}
            />
        </div>
    )
};

export default ChannelDetailsContent;