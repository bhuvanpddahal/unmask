"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    PostIdPayload,
    PostIdValidator
} from "@/lib/validators/post";
import {
    DeleteBookmarkPayload,
    DeleteBookmarkValidator,
    GetBookmarkedPostsPayload,
    GetBookmarkedPostsValidator
} from "@/lib/validators/bookmark";

export const bookmarkOrUnbookmarkPost = async (payload: PostIdPayload) => {
    try {
        const validatedFields = PostIdValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { postId } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) throw new Error("Post not found");

        const existingBookmark = await db.bookmark.findUnique({
            where: {
                bookmarkerId_postId: {
                    bookmarkerId: session.user.id,
                    postId
                }
            }
        });

        if (existingBookmark) { // If the user has previously bookmarked the post, unbookmark it by deleting the bookmark
            await db.bookmark.delete({
                where: {
                    bookmarkerId_postId: {
                        bookmarkerId: session.user.id,
                        postId
                    }
                }
            });
        } else { // If the user hasn't bookmarked the post yet, bookmark it by creating a new bookmark
            await db.bookmark.create({
                data: {
                    bookmarkerId: session.user.id,
                    postId
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const getBookmarkedPosts = async (payload: GetBookmarkedPostsPayload) => {
    try {
        const validatedFields = GetBookmarkedPostsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { page, limit, sort } = validatedFields.data;

        let orderByClause = {};

        if (sort === "recent") {
            orderByClause = { bookmarkedAt: "desc" };
        } else {
            orderByClause = { bookmarkedAt: "asc" };
        }

        const bookmarks = await db.bookmark.findMany({
            where: {
                bookmarkerId: session.user.id
            },
            orderBy: orderByClause,
            take: limit,
            skip: (page - 1) * limit,
            select: {
                id: true,
                bookmarkedAt: true,
                post: {
                    select: {
                        id: true,
                        creatorId: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        creator: {
                            select: {
                                username: true,
                                image: true
                            }
                        },
                        poll: {
                            select: {
                                options: {
                                    select: {
                                        _count: {
                                            select: {
                                                votes: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        likes: {
                            where: {
                                likerId: session?.user.id
                            },
                            select: {
                                likerId: true
                            }
                        },
                        comments: {
                            select: {
                                _count: {
                                    select: {
                                        replies: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                views: true
                            }
                        }
                    }
                }
            }
        });

        const totalBookmarks = await db.bookmark.count({
            where: { bookmarkerId: session.user.id }
        });
        const hasNextPage = totalBookmarks > (page * limit);

        return { bookmarks, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const deleteBookmark = async (payload: DeleteBookmarkPayload) => {
    try {
        const validatedFields = DeleteBookmarkValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { bookmarkId } = validatedFields.data;

        const bookmark = await db.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        if (!bookmark) return { error: "Bookmark not found" };
        if (bookmark.bookmarkerId !== session.user.id) return { error: "Unpermitted" };

        await db.bookmark.delete({
            where: {
                id: bookmarkId
            }
        });

        return { success: "Bookmark deleted successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};