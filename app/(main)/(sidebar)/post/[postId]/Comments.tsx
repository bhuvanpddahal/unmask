import {
    Comment as CommentType,
    Reply as ReplyType
} from "@prisma/client";
import { notFound } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import SortBy from "./SortBy";
import Replies from "./Replies";
import AdBanner from "../../AdBanner";
import Comment, { CommentLoader } from "./Comment";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { getComments } from "@/actions/comment";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { COMMENTS_PER_PAGE, REPLIES_PER_PAGE } from "@/constants";

interface CommentsProps {
    postId: string;
    sort: string;
}

interface FetchCommentsParams {
    pageParam: number;
}

export type Sort = "oldest" | "newest" | "top";

export type ReplyDataType = (ReplyType & {
    replier: {
        username: string;
        image: string | null;
    };
    likes: {
        likerId: string;
    }[];
    _count: {
        likes: number;
    };
});

interface CommentsData {
    comments: (CommentType & {
        commenter: {
            username: string,
            image: string | null;
        }
        likes: {
            likerId: string;
        }[];
        _count: {
            likes: number;
            replies: number;
        };
        replies: ReplyDataType[];
    })[];
    hasNextPage: boolean;
}

const isValidSort = (value: string) => {
    return value === "oldest" || value === "newest" || value === "top";
};

const Comments = ({
    postId,
    sort
}: CommentsProps) => {
    const user = useCurrentUser();
    const { toast } = useToast();

    const fetchComments = async ({ pageParam }: FetchCommentsParams) => {
        const payload = {
            postId,
            sort: sort as Sort,
            page: pageParam,
            commentsLimit: COMMENTS_PER_PAGE,
            repliesLimit: REPLIES_PER_PAGE
        };
        const data = await getComments(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch comments",
                description: "Something went wrong"
            });
            return { comments: [], hasNextPage: false };
        }
        return data as CommentsData;
    };

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["post", postId, { sort }],
        queryFn: fetchComments,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasNextPage) {
                return pages.length + 1;
            } else {
                return null;
            }
        }
    });

    const comments = data?.pages.flatMap((page) => page.comments);

    if (!isValidSort(sort)) return notFound();
    if (isLoading) return <CommentsLoader sort={sort} />
    if (!comments) return <div className="text-center text-sm text-destructive font-medium py-3">❌ Error: No comments</div>

    return (
        <div className="p-4">
            <SortBy
                sort={sort}
                postId={postId}
            />
            {comments.length ? (
                <ul className="space-y-4">
                    {comments.map((comment) => {
                        const isLiked = comment.likes[0] && comment.likes[0].likerId === user?.id;

                        return (
                            <div key={comment.id}>
                                <Comment
                                    postId={postId}
                                    commentId={comment.id}
                                    commenterId={comment.commenterId}
                                    commenterUsername={comment.commenter.username}
                                    commenterImage={comment.commenter.image}
                                    comment={comment.comment}
                                    initialLikesCount={comment._count.likes}
                                    commentedAt={comment.commentedAt}
                                    updatedAt={comment.updatedAt}
                                    initialIsLiked={isLiked}
                                />
                                <Replies
                                    sort={sort as Sort}
                                    postId={postId}
                                    commentId={comment.id}
                                    replies={comment.replies}
                                    totalReplies={comment._count.replies}
                                />
                            </div>
                        )
                    })}
                    {hasNextPage && (
                        isFetchingNextPage ? (
                            Array.from({ length: 3 }, (_, index) => (
                                <CommentLoader key={index} />
                            ))
                        ) : (
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    className="font-semibold"
                                    onClick={() => fetchNextPage()}
                                >
                                    View more comments
                                </Button>
                            </div>
                        )
                    )}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm font-medium text-center">
                    No comments
                </p>
            )}
            <AdBanner />
        </div >
    )
};

export default Comments;

interface CommentsLoaderProps {
    sort: string;
}

export const CommentsLoader = ({
    sort
}: CommentsLoaderProps) => (
    <div className="p-4">
        <SortBy
            sort={sort}
            className="pointer-events-none"
        />
        <ul className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
                <CommentLoader key={index} />
            ))}
        </ul>
        <AdBanner />
    </div>
);