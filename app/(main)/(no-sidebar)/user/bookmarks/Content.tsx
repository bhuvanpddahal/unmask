"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Post as PostType } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";

import SortBy from "./SortBy";
import Post, { PostLoader } from "@/app/(main)/Post";
import BookmarkHeader, { BookmarkHeaderLoader } from "./BookmarkHeader";
import { useToast } from "@/hooks/useToast";
import { POSTS_PER_PAGE } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getBookmarkedPosts } from "@/actions/bookmark";

interface FetchPostsParams {
    pageParam: number;
}

export type Sort = "recent" | "oldest";

interface BookmarksData {
    bookmarks: {
        id: string;
        bookmarkedAt: Date;
        post: (Omit<PostType, "image"> & {
            creator: {
                image: string | null;
                username: string;
            };
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
        })
    }[];
    hasNextPage: boolean;
}

const isValidSort = (value: string) => {
    return value === "recent" || value === "oldest";
};

const UserBookmarksContent = () => {
    const user = useCurrentUser();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "recent";
    const { toast } = useToast();
    const { ref, inView } = useInView();

    const fetchBookmarkedPosts = async ({ pageParam }: FetchPostsParams) => {
        const payload = { sort: sort as Sort, page: pageParam, limit: POSTS_PER_PAGE };
        const data = await getBookmarkedPosts(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch more bookmarks",
                description: "Something went wrong"
            });
            return { bookmarks: [], hasNextPage: false };
        }
        return data as BookmarksData;
    };

    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["user", "bookmarks", { sort }],
        queryFn: fetchBookmarkedPosts,
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

    const bookmarks = data?.pages.flatMap((page) => page.bookmarks);

    if (!isValidSort(sort)) return notFound();
    if (isLoading) return <UserBookmarksContentLoader sort={sort} />
    if (!bookmarks) return <div className="text-center text-sm text-destructive font-medium py-20">❌ Error: No bookmarks</div>

    return (
        <>
            <SortBy sort={sort} />
            {!bookmarks.length && (
                <div className="py-20 flex flex-col items-center justify-center gap-y-2">
                    <Image
                        src="/empty.png"
                        alt="Empty"
                        height={80}
                        width={80}
                    />
                    <p className="text-sm font-medium text-zinc-400">
                        No bookmarks
                    </p>
                </div>
            )}
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {bookmarks.map((bookmark, index) => {
                    const pollVotesCount = bookmark.post.poll?.options.reduce((acc, option) => {
                        return acc + option._count.votes;
                    }, 0);
                    const repliesCount = bookmark.post.comments.reduce((acc, comment) => {
                        return acc + comment._count.replies;
                    }, 0);
                    const commentsCount = bookmark.post.comments.length + repliesCount;
                    const isLiked = bookmark.post.likes[0] && bookmark.post.likes[0].likerId === user?.id;

                    return (
                        <div
                            key={index}
                            className="flex flex-col border rounded-md"
                            ref={index === bookmarks.length - 1 ? ref : undefined}
                        >
                            <BookmarkHeader
                                bookmarkId={bookmark.id}
                                bookmarkedAt={bookmark.bookmarkedAt}
                            />
                            <Post
                                creatorId={bookmark.post.creatorId}
                                creatorUsername={bookmark.post.creator.username}
                                creatorImage={bookmark.post.creator.image}
                                postId={bookmark.post.id}
                                title={bookmark.post.title}
                                description={bookmark.post.description}
                                postImage={null}
                                pollVotesCount={pollVotesCount}
                                createdAt={bookmark.post.createdAt}
                                updatedAt={bookmark.post.updatedAt}
                                likesCount={bookmark.post._count.likes}
                                isLiked={isLiked}
                                commentsCount={commentsCount}
                                viewsCount={bookmark.post._count.views}
                                className="flex-1 border-none rounded-t-none shadow-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-950 hover:shadow-none"
                            />
                        </div>
                    )
                })}
                {isFetchingNextPage && (
                    Array.from({ length: 2 }, (_, index) => (
                        <div key={index} className="border rounded-md">
                            <BookmarkHeaderLoader />
                            <PostLoader className="border-none shadow-none" />
                        </div>
                    ))
                )}
            </ul>
        </>
    )
};

export default UserBookmarksContent;

interface UserBookmarksContentLoaderProps {
    sort: string;
}

export const UserBookmarksContentLoader = ({
    sort
}: UserBookmarksContentLoaderProps) => (
    <>
        <SortBy sort={sort} className="pointer-events-none" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...new Array(6)].map((_, index) => (
                <div key={index} className="border rounded-md">
                    <BookmarkHeaderLoader />
                    <PostLoader className="border-none shadow-none" />
                </div>
            ))}
        </ul>
    </>
);