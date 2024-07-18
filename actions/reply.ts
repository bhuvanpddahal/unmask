"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    DeleteReplyPayload,
    DeleteReplyValidator,
    EditReplyPayload,
    EditReplyValidator,
    GetMoreRepliesPayload,
    GetMoreRepliesValidator,
    LikeOrUnlikeReplyPayload,
    LikeOrUnlikeReplyValidator,
    ReplyOnCommentPayload,
    ReplyOnCommentValidator
} from "@/lib/validators/reply";

export const replyOnComment = async (payload: ReplyOnCommentPayload) => {
    try {
        const validatedFields = ReplyOnCommentValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { commentId, reply } = validatedFields.data;

        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!comment) throw new Error("Comment not found");

        await db.reply.create({
            data: {
                replierId: session.user.id,
                commentId,
                reply
            }
        });

        return { success: "Replied on comment successfully" };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const editReply = async (payload: EditReplyPayload) => {
    try {
        const validatedFields = EditReplyValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { replyId, editedReply } = validatedFields.data;

        const reply = await db.reply.findUnique({
            where: {
                id: replyId
            }
        });
        if (!reply) throw new Error("Reply not found");
        if (reply.replierId !== session.user.id) throw new Error("Not allowed");

        await db.reply.update({
            where: {
                id: replyId
            },
            data: {
                reply: editedReply
            }
        });

        return { success: "Reply edited successfully" };
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const deleteReply = async (payload: DeleteReplyPayload) => {
    try {
        const validatedFields = DeleteReplyValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { replyId } = validatedFields.data;

        const reply = await db.reply.findUnique({
            where: {
                id: replyId
            }
        });
        if (!reply) return { error: "Reply not found" };
        if (reply.replierId !== session.user.id) return { error: "Not permitted" };

        await db.reply.delete({
            where: {
                id: replyId
            }
        });

        return { success: "Reply deleted successfully" };
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }
};

export const getMoreReplies = async (payload: GetMoreRepliesPayload) => {
    try {
        const validatedFields = GetMoreRepliesValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();

        const { commentId, page, limit, repliesPerPage } = validatedFields.data;

        const replies = await db.reply.findMany({
            where: {
                commentId
            },
            orderBy: {
                repliedAt: "asc"
            },
            take: limit,
            skip: repliesPerPage + (page - 1) * limit,
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
        });

        const totalReplies = await db.reply.count({
            where: { commentId }
        });
        const hasNextPage = totalReplies > (repliesPerPage + page * limit);

        return { replies, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const likeOrUnlikeReply = async (payload: LikeOrUnlikeReplyPayload) => {
    try {
        const validatedFields = LikeOrUnlikeReplyValidator.safeParse(payload);
        if (!validatedFields.success) throw new Error("Invalid fields");

        const session = await auth();
        if (!session?.user || !session.user.id) throw new Error("Unauthorized");

        const { replyId } = validatedFields.data;

        const reply = await db.reply.findUnique({
            where: {
                id: replyId
            }
        });
        if (!reply) throw new Error("Reply not found");

        const existingLike = await db.replyLike.findUnique({
            where: {
                likerId_replyId: {
                    likerId: session.user.id,
                    replyId
                }
            }
        });

        if (existingLike) { // If the user has previously liked the reply, unlike it by deleting the reply like
            await db.replyLike.delete({
                where: {
                    likerId_replyId: {
                        likerId: session.user.id,
                        replyId
                    }
                }
            });
        } else { // If the user hasn't liked the reply yet, like it by creating a new reply like
            await db.replyLike.create({
                data: {
                    replyId,
                    likerId: session.user.id
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};