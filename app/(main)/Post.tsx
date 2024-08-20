import { useRouter } from "next/navigation";

import PostFooter, { PostFooterLoader } from "./PostFooter";
import PostHeader, { PostHeaderLoader } from "./PostHeader";
import PostContent, { PostContentLoader } from "./PostContent";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface PostProps {
    creatorId: string;
    creatorUsername: string;
    creatorImage: string | null;
    channelId: string | null;
    channelName: string;
    postId: string;
    title: string;
    description: string;
    postImage: string | null;
    pollVotesCount?: number;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    isLiked: boolean;
    commentsCount: number;
    viewsCount: number;
    lastPostRef?: (node?: Element | null) => void;
    className?: string;
}

const Post = ({
    creatorId,
    creatorUsername,
    creatorImage,
    channelId,
    channelName,
    postId,
    title,
    description,
    postImage,
    pollVotesCount,
    createdAt,
    updatedAt,
    likesCount,
    isLiked,
    commentsCount,
    viewsCount,
    lastPostRef,
    className = ""
}: PostProps) => {
    const router = useRouter();

    return (
        <Card
            ref={lastPostRef}
            className={cn("cursor-pointer transition-shadow hover:shadow-md dark:hover:shadow-zinc-700", className)}
            onClick={() => router.push(`/post/${postId}`)}
        >
            <PostHeader
                creatorId={creatorId}
                creatorUsername={creatorUsername}
                creatorImage={creatorImage}
                channelId={channelId}
                channelName={channelName}
                postId={postId}
                title={title}
                description={description}
                createdAt={createdAt}
                updatedAt={updatedAt}
            />
            <PostContent
                title={title}
                description={description}
                postImage={postImage}
                pollVotesCount={pollVotesCount}
            />
            <PostFooter
                postId={postId}
                initialLikesCount={likesCount}
                initialIsLiked={isLiked}
                commentsCount={commentsCount}
                viewsCount={viewsCount}
            />
        </Card>
    );
};

export default Post;

interface PostsLoaderProps {
    className?: string;
}

export const PostLoader = ({
    className = ""
}: PostsLoaderProps) => (
    <Card className={className}>
        <PostHeaderLoader />
        <PostContentLoader />
        <PostFooterLoader />
    </Card>
);