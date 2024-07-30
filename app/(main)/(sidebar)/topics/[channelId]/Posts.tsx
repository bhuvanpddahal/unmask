import Image from "next/image";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import SortBy from "./SortBy";
import Post, { PostLoader } from "@/app/(main)/Post";
import { PostsData } from "../../Posts";
import { useToast } from "@/hooks/useToast";
import { POSTS_PER_PAGE } from "@/constants";
import { getChannelPosts } from "@/actions/post";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PostsProps {
    channelId: string;
    sort: string;
}

interface FetchChannelPostsParams {
    pageParam: number;
}

type Sort = "hot" | "recent";

const isValidSort = (value: string) => {
    return value === "hot" || value === "recent";
};

const Posts = ({
    channelId,
    sort
}: PostsProps) => {
    const user = useCurrentUser();
    const { toast } = useToast();
    const { ref, inView } = useInView();

    const fetchChannelPosts = async ({ pageParam }: FetchChannelPostsParams) => {
        const payload = { channelId, sort: sort as Sort, page: pageParam, limit: POSTS_PER_PAGE };
        const data = await getChannelPosts(payload);
        if (data.error) {
            toast({
                variant: "destructive",
                title: "Failed to fetch posts",
                description: data.error
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
        queryKey: ["topics", channelId, { sort }],
        queryFn: fetchChannelPosts,
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
            <SortBy channelId={channelId} sort={sort} />
            {posts.length ? (
                <ul className="space-y-5">
                    {posts.map((post, index) => {
                        const pollVotesCount = post.poll?.options.reduce((acc, option) => {
                            return acc + option._count.votes;
                        }, 0);
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
            ) : (
                <div className="py-10 flex flex-col items-center justify-center gap-y-2">
                    <Image
                        src="/empty.png"
                        alt="Empty"
                        height={80}
                        width={80}
                    />
                    <p className="text-sm font-medium text-zinc-400">
                        No posts in this channel
                    </p>
                </div>
            )}
        </div>
    )
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