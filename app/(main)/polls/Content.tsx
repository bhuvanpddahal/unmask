"use client";

import { useEffect } from "react";
import { Post as PostType } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";

import SortBy from "./SortBy";
import Post, { PostLoader } from "./Post";
import { useToast } from "@/hooks/useToast";
import { POSTS_PER_PAGE } from "@/constants";
import { getPostsWithPoll } from "@/actions/post";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface FetchPostsWithPollParams {
    pageParam: number;
}

export type Sort = "hot" | "recent";

interface PostsData {
    posts: (Omit<PostType, "image"> & {
        creator: {
            image: string | null;
            username: string;
        };
        poll: {
            id: string;
            options: {
                id: string;
                option: string;
                _count: {
                    votes: number;
                };
                votes: {
                    voterId: string;
                }[];
            }[];
        } | null;
        likes: {
            likerId: string;
        }[];
        comments: {
            _count: {
                replies: number;
            }
        }[];
        _count: {
            likes: number;
            views: number;
        };
    })[];
    hasNextPage: boolean;
}

const isValidSort = (value: string) => {
    return value === "hot" || value === "recent";
};

const PollsContent = () => {
    const user = useCurrentUser();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "hot";
    const { toast } = useToast();
    const { ref, inView } = useInView();

    const fetchPostsWithPoll = async ({ pageParam }: FetchPostsWithPollParams) => {
        const payload = { sort: sort as Sort, page: pageParam, limit: POSTS_PER_PAGE };
        const data = await getPostsWithPoll(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong"
            });
            return { posts: [], hasNextPage: false };
        }
        return data as PostsData;
    };

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["polls", { sort }],
        queryFn: fetchPostsWithPoll,
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

    const posts = data?.pages.flatMap((page) => page.posts);

    if (!isValidSort(sort)) return notFound();
    if (isLoading) return <PollsContentLoader sort={sort} />
    if (!posts) return <div className="text-center text-sm text-destructive font-medium py-3">❌ Error: No polls</div>

    return (
        <div>
            <SortBy sort={sort} />
            <ul className="space-y-5">
                {posts.map((post, index) => {
                    const repliesCount = post.comments.reduce((acc, comment) => {
                        return acc + comment._count.replies;
                    }, 0);
                    const commentsCount = post.comments.length + repliesCount;
                    const isLiked = post.likes[0] && post.likes[0].likerId === user?.id;

                    return (
                        <Post
                            key={index}
                            creatorId={post.creatorId}
                            creatorUsername={post.creator.username}
                            creatorImage={post.creator.image}
                            postId={post.id}
                            title={post.title}
                            description={post.description}
                            poll={post.poll}
                            createdAt={post.createdAt}
                            updatedAt={post.updatedAt}
                            likesCount={post._count.likes}
                            isLiked={isLiked}
                            commentsCount={commentsCount}
                            viewsCount={post._count.views}
                            lastPostRef={index === posts.length - 1 ? ref : undefined}
                        />
                    )
                })}
                {isFetchingNextPage && (
                    Array.from({ length: 3 }, (_, index) => (
                        <PostLoader key={index} />
                    ))
                )}
            </ul>
        </div>
    )
};

export default PollsContent;

interface PollsContentLoaderProps {
    sort: string;
}

export const PollsContentLoader = ({
    sort
}: PollsContentLoaderProps) => (
    <div>
        <SortBy sort={sort} />
        <ul className="space-y-5">
            {([...new Array(5)]).map((_, index) => (
                <PostLoader key={index} />
            ))}
        </ul>
    </div>
);