import { useRouter } from "next/navigation";

import PostFooter, { PostFooterLoader } from "../../PostFooter";
import PostHeader, { PostHeaderLoader } from "../../PostHeader";
import PostContent, { PostContentLoader } from "./PostContent";
import { Card } from "@/components/ui/Card";
import { PollOption } from "../post/[postId]/PostContent";

export type Poll = {
    id: string;
    options: PollOption[];
} | null;

interface PostProps {
    creatorId: string;
    creatorUsername: string;
    creatorImage: string | null;
    postId: string;
    title: string;
    description: string;
    poll: Poll;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    isLiked: boolean;
    commentsCount: number;
    viewsCount: number;
    lastPostRef?: (node?: Element | null) => void;
}

const Post = ({
    creatorId,
    creatorUsername,
    creatorImage,
    postId,
    title,
    description,
    poll,
    createdAt,
    updatedAt,
    likesCount,
    isLiked,
    commentsCount,
    viewsCount,
    lastPostRef
}: PostProps) => {
    const router = useRouter();

    return (
        <Card
            ref={lastPostRef}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/posts/${postId}`)}
        >
            <PostHeader
                creatorId={creatorId}
                creatorUsername={creatorUsername}
                creatorImage={creatorImage}
                postId={postId}
                title={title}
                description={description}
                createdAt={createdAt}
                updatedAt={updatedAt}
            />
            <PostContent
                postId={postId}
                title={title}
                description={description}
                poll={poll}
            />
            <PostFooter
                postId={postId}
                initialLikesCount={likesCount}
                initialIsLiked={isLiked}
                commentsCount={commentsCount}
                viewsCount={viewsCount}
            />
        </Card>
    )
};

export default Post;

export const PostLoader = () => (
    <Card>
        <PostHeaderLoader />
        <PostContentLoader />
        <PostFooterLoader />
    </Card>
);