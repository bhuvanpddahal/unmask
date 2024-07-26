"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import Comments, { CommentsLoader } from "./Comments";
import PostHeader, { PostHeaderLoader } from "./PostHeader";
import PostContent, { PostContentLoader } from "./PostContent";
import PostFooter, { PostFooterLoader } from "../../../PostFooter";
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
        data,
        isLoading
    } = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const payload = { postId };
            const data = await getPost(payload);
            return data;
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

    const repliesCount = data.post?.comments.reduce((acc, comment) => {
        return acc + comment._count.replies;
    }, 0) || 0;
    const commentsCount = (data.post?.comments.length || 0) + repliesCount;
    const isLiked = data.post?.likes[0] && data.post.likes[0].likerId === user?.id;
    const isBookmarked = data.post?.bookmarks[0] && data.post.bookmarks[0].bookmarkerId === user?.id;

    return (
        <div>
            <Card>
                <PostHeader
                    creatorId={data.post?.creatorId || ""}
                    creatorUsername={data.post?.creator.username || ""}
                    creatorImage={data.post?.creator.image || ""}
                    postId={data.post?.id || ""}
                    title={data.post?.title || ""}
                    description={data.post?.description || ""}
                    createdAt={data.post?.createdAt || new Date()}
                    updatedAt={data.post?.updatedAt || new Date()}
                    isBookmarked={!!isBookmarked}
                />
                <PostContent
                    postId={postId}
                    title={data.post?.title || ""}
                    description={data.post?.description || ""}
                    postImage={data.post?.image || ""}
                    poll={data.post?.poll || null}
                />
                <PostFooter
                    postId={postId}
                    initialLikesCount={data.post?._count.likes || 0}
                    initialIsLiked={!!isLiked}
                    commentsCount={commentsCount}
                    viewsCount={data.post?._count.views || 0}
                />
                <Separator />
                <Comments
                    postId={postId}
                    sort={sort}
                />
            </Card>
            <CommentInput postId={postId} />
        </div>
    )
};

export default PostDetailsContent;