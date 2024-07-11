"use client";

import { useEffect, useState } from "react";
import { Post as PostType } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";

import Post, { PostLoader } from "./Post";
import SortBy, { SortByLoader } from "./SortBy";
import { getPosts } from "@/actions/post";
import { useToast } from "@/hooks/useToast";
import { POSTS_PER_PAGE } from "@/constants";

interface FetchPostsParams {
    pageParam: number;
}

type Sort = "hot" | "recent" | "views";

interface PostsData {
    posts: (PostType & {
        creator: {
            image: string | null;
            username: string;
        };
        poll: {
            _count: {
                votes: number;
            };
        } | null;
    })[];
    hasNextPage: boolean;
}

const isValidSort = (value: string) => {
    return value === "hot" || value === "recent" || value === "views";
};

const Posts = () => {
    const { toast } = useToast();
    const { ref, inView } = useInView();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "hot";

    const fetchPosts = async ({ pageParam }: FetchPostsParams) => {
        const payload = { sort: sort as Sort, page: pageParam, limit: POSTS_PER_PAGE };
        const data = await getPosts(payload);
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
    if (isLoading) return <PostsLoader />
    if (!posts) return <div>Error</div>

    return (
        <div>
            <SortBy />
            <ul className="space-y-5">
                {posts.map((post, index) => (
                    <Post
                        key={index}
                        creatorId={post.creatorId}
                        creatorUsername={post.creator.username}
                        creatorImage={post.creator.image}
                        postId={post.id}
                        title={post.title}
                        description={post.description}
                        postImage={post.image}
                        pollVotes={post.poll?._count.votes}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                        lastPostRef={index === posts.length - 1 ? ref : undefined}
                    />
                ))}
                {isFetchingNextPage && (
                    Array.from({ length: 3 }, (_, index) => (
                        <PostLoader key={index} />
                    ))
                )}
            </ul>
        </div>
    )
};

export default Posts;

export const PostsLoader = () => (
    <div>
        <SortByLoader />
        <ul className="space-y-5">
            {([...new Array(5)]).map((_, index) => (
                <PostLoader key={index} />
            ))}
        </ul>
    </div>
);