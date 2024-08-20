"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Post as PostType } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";

import SortBy from "./SortBy";
import Post, { PostLoader } from "../Post";
import { getPosts } from "@/actions/post";
import { useToast } from "@/hooks/useToast";
import { POSTS_PER_PAGE } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface FetchPostsParams {
    pageParam: number;
}

export type Sort = "hot" | "recent" | "views";

export interface PostsData {
    posts: (PostType & {
        creator: {
            image: string | null;
            username: string;
        };
        channel: {
            name: string;
        } | null;
        poll: {
            options: {
                _count: {
                    votes: number;
                };
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
    return value === "hot" || value === "recent" || value === "views";
};

const Posts = () => {
    const user = useCurrentUser();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "hot";
    const { toast } = useToast();
    const { ref, inView } = useInView();

    const fetchPosts = async ({ pageParam }: FetchPostsParams) => {
        const payload = { sort: sort as Sort, page: pageParam, limit: POSTS_PER_PAGE };
        const data = await getPosts(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch posts",
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
        queryKey: ["/", { sort }],
        queryFn: fetchPosts,
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
    if (isLoading) return <PostsLoader sort={sort} />
    if (!posts) return <div className="text-center text-sm text-destructive font-medium py-3">❌ Error: No posts</div>

    return (
        <div>
            <SortBy sort={sort} />
            {!posts.length && (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Image
                        src="/empty.svg"
                        alt="Empty"
                        height={80}
                        width={80}
                    />
                    <p className="text-sm font-medium text-zinc-400">
                        No posts
                    </p>
                </div>
            )}
            <ul className="space-y-5">
                {posts.map((post, index) => {
                    const repliesCount = post.comments.reduce((acc, comment) => {
                        return acc + comment._count.replies;
                    }, 0);
                    const pollVotesCount = post.poll?.options.reduce((acc, option) => {
                        return acc + option._count.votes;
                    }, 0);
                    const commentsCount = post.comments.length + repliesCount;
                    const isLiked = post.likes[0] && post.likes[0].likerId === user?.id;

                    return (
                        <Post
                            key={index}
                            creatorId={post.creatorId}
                            creatorUsername={post.creator.username}
                            creatorImage={post.creator.image}
                            channelId={post.channelId}
                            channelName={post.channel?.name || ""}
                            postId={post.id}
                            title={post.title}
                            description={post.description}
                            postImage={post.image}
                            pollVotesCount={pollVotesCount}
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
    );
};

export default Posts;

interface PostsLoaderProps {
    sort: string;
}

export const PostsLoader = ({ sort }: PostsLoaderProps) => (
    <div>
        <SortBy sort={sort} className="pointer-events-none" />
        <ul className="space-y-5">
            {([...new Array(5)]).map((_, index) => (
                <PostLoader key={index} />
            ))}
        </ul>
    </div>
);