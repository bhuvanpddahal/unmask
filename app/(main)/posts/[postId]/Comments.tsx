import Image from "next/image";
import {
    Comment as CommentType,
    Reply as ReplyType
} from "@prisma/client";
import {
    notFound,
    useRouter,
    useSearchParams
} from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import Reply from "./Reply";
import SortBy, { SortByLoader } from "./SortBy";
import Comment, { CommentLoader } from "./Comment";
import { useToast } from "@/hooks/useToast";
import { getComments } from "@/actions/post";
import { Button } from "@/components/ui/Button";
import { COMMENTS_PER_PAGE, REPLIES_PER_PAGE } from "@/constants";

interface CommentsProps {
    postId: string;
}

interface FetchCommentsParams {
    pageParam: number;
}

type Sort = "oldest" | "newest" | "top";

interface CommentsData {
    comments: (CommentType & {
        commenter: {
            username: string,
            image: string | null;
        }
        likes: {
            id: string;
            likerId: string;
            commentId: string;
        }[];
        _count: {
            likes: number;
            replies: number;
        };
        replies: (ReplyType & {
            replier: {
                username: string;
                image: string | null;
            };
            likes: {
                id: string;
                likerId: string;
                replyId: string;
            }[];
            _count: {
                likes: number;
            };
        })[];
    })[];
    hasNextPage: boolean;
}

const isValidSort = (value: string) => {
    return value === "oldest" || value === "newest" || value === "top";
};

const Comments = ({
    postId
}: CommentsProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const { ref, inView } = useInView();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "oldest";

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
                title: "Error",
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
        queryKey: ["posts", { sort }],
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

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const comments = data?.pages.flatMap((page) => page.comments);

    if (!isValidSort(sort)) return notFound();
    if (isLoading) return <CommentsLoader />
    if (!comments) return <div>Error</div>

    return (
        <div className="p-4">
            <SortBy />
            {comments.length ? (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            <Comment
                                commenterUsername={comment.commenter.username}
                                commenterImage={comment.commenter.image}
                                comment={comment.comment}
                                likesCount={comment._count.likes}
                            />
                            <ul className="pl-12 space-y-3 mt-4">
                                {comment.replies.map((reply) => (
                                    <Reply
                                        key={reply.id}
                                        replierUsername={reply.replier.username}
                                        replierImage={reply.replier.username}
                                        reply={reply.reply}
                                        likesCount={reply._count.likes}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm font-medium text-center">
                    No comments
                </p>
            )}
            <div
                className="bg-primary flex gap-4 p-6 mt-6 rounded-sm cursor-pointer hover:opacity-90"
                onClick={() => router.push("https://rave-hq.vercel.app")}
            >
                <Image
                    src="https://rave-hq.vercel.app/logo-icon.png"
                    alt="RaveHQ Logo"
                    width={40}
                    height={11}
                    className="h-[40px] w-auto"
                />
                <p className="text-xl text-primary-foreground font-semibold">
                    Grow Trust & Credibility with Authentic Testimonials using RaveHQ
                </p>
                <Button className="min-w-fit bg-white self-center text-primary transition-opacity hover:bg-zinc-100">
                    Open
                </Button>
            </div>
        </div>
    )
};

export default Comments;

export const CommentsLoader = () => (
    <div className="p-4">
        <SortByLoader />
        <ul className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
                <CommentLoader key={index} />
            ))}
        </ul>
    </div>
);