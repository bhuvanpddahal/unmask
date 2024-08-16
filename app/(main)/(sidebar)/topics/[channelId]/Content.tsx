"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import AdBanner from "../../AdBanner";
import Posts, { PostsLoader } from "./Posts";
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
            <AdBanner />
            <PostsLoader sort={sort} />
        </div>
    )
    if (!data || data.error) return (
        <div className="py-20 flex flex-col items-center justify-center gap-y-1">
            <Image
                src="/error.svg"
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
    const canViewPosts = data.channel?.visibility === "public" || isFollowed;

    return (
        <div className="space-y-4">
            <ChannelInfo
                channelId={channelId}
                creatorId={data.channel?.creatorId || ""}
                channelName={data.channel?.name || ""}
                channelDescription={data.channel?.description || ""}
                bannerImage={data.channel?.bannerImage || null}
                profileImage={data.channel?.profileImage || null}
                visibility={data.channel?.visibility || "private"}
                inviteCode={data.channel?.inviteCode || null}
                initialFollowsCount={data.channel?._count.follows || 0}
                initialIsFollowed={!!isFollowed}
            />
            <AdBanner />
            {canViewPosts ? (
                <Posts
                    channelId={channelId}
                    sort={sort}
                />
            ) : (
                <div className="max-w-md text-sm font-medium text-zinc-400 text-center mx-auto py-10">
                    This channel is private. To view its content, you must be a member. Please request an invitation from the moderator to gain access.
                </div>
            )}
        </div>
    );
};

export default ChannelDetailsContent;