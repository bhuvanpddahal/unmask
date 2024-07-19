"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import Comments, { CommentsLoader } from "./Comments";
import PostHeader, { PostHeaderLoader } from "./PostHeader";
import PostContent, { PostContentLoader } from "./PostContent";
import PostFooter, { PostFooterLoader } from "../../PostFooter";
import CommentInput, { CommentInputLoader } from "./CommentInput";
import { getPost } from "@/actions/post";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PostDetailsContentProps {
    postId: string;
}

const PostDetailsContent = ({
    postId
}: PostDetailsContentProps) => {
    const user = useCurrentUser();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "oldest";

    const {
        data: post,
        isLoading
    } = useQuery({
        queryKey: ["posts", postId],
        queryFn: async () => {
            const payload = { postId };
            const post = await getPost(payload);
            return post;
        }
    });

    if (isLoading) return (
        <div>
            <Card>
                <PostHeaderLoader />
                <PostContentLoader />
                <PostFooterLoader />
                <Separator />
                <CommentsLoader sort={sort} />
            </Card>
            <CommentInputLoader />
        </div>
    )
    if (!post || post?.error) return (
        <div className="py-20 flex flex-col items-center justify-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <p className="text-sm font-medium text-zinc-400">
                {post?.error || "Something went wrong"}
            </p>
        </div>
    )

    const isLiked = post.likes[0] && post.likes[0].likerId === user?.id;
    const repliesCount = post.comments.reduce((acc, comment) => {
        return acc + comment._count.replies;
    }, 0);
    const commentsCount = post.comments.length + repliesCount;

    return (
        <div>
            <Card>
                <PostHeader
                    creatorId={post.creatorId}
                    creatorUsername={post.creator.username}
                    creatorImage={post.creator.image}
                    postId={post.id}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                />
                <PostContent
                    postId={postId}
                    title={post.title}
                    description={post.description}
                    postImage={post.image}
                    poll={post.poll}
                />
                <PostFooter
                    postId={postId}
                    initialLikesCount={post._count.likes}
                    initialIsLiked={isLiked}
                    commentsCount={commentsCount}
                    viewsCount={post._count.views}
                />
                <Separator />
                <Comments
                    postId={post.id}
                    sort={sort}
                />
            </Card>
            <CommentInput postId={post.id} />
        </div>
    )
};

export default PostDetailsContent;