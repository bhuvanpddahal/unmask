"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    CommentIdPayload,
    CommentIdValidator,
    CommentOnPostPayload,
    CommentOnPostValidator,
    EditCommentPayload,
    EditCommentValidator,
    GetCommentsPayload,
    GetCommentsValidator
} from "@/lib/validators/comment";

export const getComments = async (payload: GetCommentsPayload) => {
    try {
        const validatedFields = GetCommentsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();

        const { postId, page, commentsLimit, repliesLimit, sort } = validatedFields.data;

        let orderByClause = {};

        if (sort === "oldest") {
            orderByClause = { commentedAt: "asc" };
        } else if (sort === "newest") {
            orderByClause = { commentedAt: "desc" };
        } else {
            orderByClause = [
                { likes: { _count: "desc" } },
                { replies: { _count: "desc" } },
                { commentedAt: "desc" }
            ];
        }

        const comments = await db.comment.findMany({
            where: {
                postId
            },
            orderBy: orderByClause,
            take: commentsLimit,
            skip: (page - 1) * commentsLimit,
            include: {
                commenter: {
                    select: {
                        username: true,
                        image: true
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
                replies: {
                    orderBy: {
                        repliedAt: "asc"
                    },
                    take: repliesLimit,
                    include: {
                        replier: {
                            select: {
                                username: true,
                                image: true
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
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true
                    }
                }
            }
        });

        const totalComments = await db.comment.count({
            where: { postId }
        });
        const hasNextPage = totalComments > (page * commentsLimit);

        return { comments, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const commentOnPost = async (payload: CommentOnPostPayload) => {
    try {
        const validatedFields = CommentOnPostValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { postId, comment } = validatedFields.data;

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) throw new Error("Post not found");

        await db.comment.create({
            data: {
                commenterId: session.user.id,
                postId,
                comment
            }
        });

        return { success: "Comment posted successfully" };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const editComment = async (payload: EditCommentPayload) => {
    try {
        const validatedFields = EditCommentValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { commentId, editedComment } = validatedFields.data;

        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!comment) throw new Error("Comment not found");
        if (comment.commenterId !== session.user.id) throw new Error("Not allowed");

        await db.comment.update({
            where: {
                id: commentId
            },
            data: {
                comment: editedComment
            }
        });

        return { success: "Comment edited successfully" };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const deleteComment = async (payload: CommentIdPayload) => {
    try {
        const validatedFields = CommentIdValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { commentId } = validatedFields.data;

        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!comment) return { error: "Comment not found" };
        if (comment.commenterId !== session.user.id) return { error: "Not permitted" };

        await db.comment.delete({
            where: {
                id: commentId
            }
        });

        return { success: "Comment deleted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }
};

export const likeOrUnlikeComment = async (payload: CommentIdPayload) => {
    try {
        const validatedFields = CommentIdValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { commentId } = validatedFields.data;

        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!comment) throw new Error("Comment not found");

        const existingLike = await db.commentLike.findUnique({
            where: {
                likerId_commentId: {
                    likerId: session.user.id,
                    commentId
                }
            }
        });

        if (existingLike) { // If the user has previously liked the comment, unlike it by deleting the comment like
            await db.commentLike.delete({
                where: {
                    likerId_commentId: {
                        likerId: session.user.id,
                        commentId
                    }
                }
            });
        } else { // If the user hasn't liked the comment yet, like it by creating a new comment like
            await db.commentLike.create({
                data: {
                    commentId,
                    likerId: session.user.id
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};