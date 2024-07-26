import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Reply, { ReplyLoader } from "./Reply";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { getMoreReplies } from "@/actions/reply";
import type { ReplyDataType, Sort } from "./Comments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { REPLIES_PER_PAGE, REPLIES_PER_QUERY } from "@/constants";

interface RepliesProps {
    sort: Sort;
    postId: string;
    commentId: string;
    replies: ReplyDataType[];
    totalReplies: number;
}

interface FetchMoreRepliesParams {
    pageParam: number;
}

interface RepliesData {
    replies: ReplyDataType[];
    hasNextPage: boolean;
}

const Replies = ({
    sort,
    postId,
    commentId,
    replies,
    totalReplies
}: RepliesProps) => {
    const user = useCurrentUser();
    const { toast } = useToast();
    const [enabled, setEnabled] = useState(false);

    const fetchMoreReplies = async ({ pageParam }: FetchMoreRepliesParams) => {
        const payload = {
            commentId,
            page: pageParam,
            limit: REPLIES_PER_QUERY,
            repliesPerPage: REPLIES_PER_PAGE
        };
        const data = await getMoreReplies(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch replies",
                description: "Something went wrong"
            });
            return { replies: [], hasNextPage: false };
        }
        return data as RepliesData;
    };

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        enabled,
        queryKey: ["post", postId, { sort, commentId }],
        queryFn: fetchMoreReplies,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.hasNextPage) {
                return pages.length + 1;
            } else {
                return null;
            }
        }
    });

    const repliesData = data?.pages.flatMap((page) => page.replies);
    const remainingReplies = Math.max(totalReplies - replies.length - (repliesData?.length || 0), 0);

    return (
        <ul className="pl-12 space-y-3 mt-4">
            {replies.map((reply) => {
                const isLiked = reply.likes[0] && reply.likes[0].likerId === user?.id;

                return (
                    <Reply
                        key={reply.id}
                        postId={postId}
                        replyId={reply.id}
                        replierId={reply.replierId}
                        replierUsername={reply.replier.username}
                        replierImage={reply.replier.image}
                        reply={reply.reply}
                        initialLikesCount={reply._count.likes}
                        repliedAt={reply.repliedAt}
                        updatedAt={reply.updatedAt}
                        initialIsLiked={isLiked}
                    />
                )
            })}
            {(!enabled && totalReplies > replies.length) && (
                <Button
                    variant="link"
                    className="h-fit w-fit p-0 text-black dark:text-white font-semibold hover:text-accent-foreground"
                    onClick={() => setEnabled(true)}
                >
                    View {remainingReplies} more {remainingReplies === 1 ? "reply" : "replies"}
                </Button>
            )}
            {repliesData?.map((reply) => {
                const isLiked = reply.likes[0] && reply.likes[0].likerId === user?.id;

                return (
                    <Reply
                        key={reply.id}
                        postId={postId}
                        replyId={reply.id}
                        replierId={reply.replierId}
                        replierUsername={reply.replier.username}
                        replierImage={reply.replier.image}
                        reply={reply.reply}
                        initialLikesCount={reply._count.likes}
                        repliedAt={reply.repliedAt}
                        updatedAt={reply.updatedAt}
                        initialIsLiked={isLiked}
                    />
                )
            })}
            {isLoading && (
                [...new Array(Math.min(3, remainingReplies))].map((_, index) => (
                    <ReplyLoader key={index} />
                ))
            )}
            {hasNextPage && (
                isFetchingNextPage ? (
                    [...new Array(Math.min(3, remainingReplies))].map((_, index) => (
                        <ReplyLoader key={index} />
                    ))
                ) : (
                    <Button
                        variant="link"
                        className="h-fit w-fit p-0 text-black font-semibold hover:text-accent-foreground"
                        onClick={() => fetchNextPage()}
                    >
                        View {remainingReplies} more {remainingReplies === 1 ? "reply" : "replies"}
                    </Button>
                )
            )}
        </ul>
    )
};

export default Replies;