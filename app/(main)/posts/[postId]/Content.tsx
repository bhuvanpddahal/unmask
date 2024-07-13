"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import Comments, { CommentsLoader } from "./Comments";
import PostFooter, { PostFooterLoader } from "./PostFooter";
import PostHeader, { PostHeaderLoader } from "./PostHeader";
import PostContent, { PostContentLoader } from "./PostContent";
import CommentInput, { CommentInputLoader } from "./CommentInput";
import { getPost } from "@/actions/post";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";

interface PostDetailsContentProps {
    postId: string;
}

const PostDetailsContent = ({
    postId
}: PostDetailsContentProps) => {
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
                <CommentsLoader />
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
                />
                <PostContent
                    title={post.title}
                    description={post.description}
                    postImage={post.image}
                />
                <PostFooter
                    likesCount={post._count.likes}
                    commentsCount={commentsCount}
                    viewsCount={post._count.views}
                />
                <Separator />
                <Comments postId={post.id} />
            </Card>
            <CommentInput postId={post.id} />
        </div>
    )
};

export default PostDetailsContent;