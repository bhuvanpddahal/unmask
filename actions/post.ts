"use server";

import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    CommentOnPostPayload,
    CommentOnPostValidator,
    CreatePostPayload,
    CreatePostValidator,
    DeleteCommentPayload,
    DeleteCommentValidator,
    EditCommentPayload,
    EditCommentValidator,
    EditReplyPayload,
    EditReplyValidator,
    GetCommentsPayload,
    GetCommentsValidator,
    GetPostPayload,
    GetPostsPayload,
    GetPostsValidator,
    GetPostValidator,
    ReplyOnCommentPayload,
    ReplyOnCommentValidator
} from "@/lib/validators/post";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPost = async (payload: CreatePostPayload) => {
    try {
        const validatedFields = CreatePostValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { title, description, image, pollOptions } = validatedFields.data;

        let imageUrl: string | undefined = undefined;
        if (image) imageUrl = (await cloudinary.uploader.upload(image, { overwrite: false })).secure_url;

        const newPost = await db.post.create({
            data: {
                creatorId: session.user.id,
                title,
                description,
                image: imageUrl,
                poll: pollOptions ? {
                    create: {
                        options: pollOptions
                    }
                } : undefined
            },
            select: {
                id: true
            }
        });

        return { success: "New post created", postId: newPost.id };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getPosts = async (payload: GetPostsPayload) => {
    try {
        const validatedFields = GetPostsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { page, limit, sort } = validatedFields.data;

        const posts = await db.post.findMany({
            where: {},
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                poll: {
                    select: {
                        _count: {
                            select: {
                                votes: true
                            }
                        }
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
        });

        const totalPosts = await db.post.count({
            where: {}
        });
        const hasNextPage = totalPosts > (page * limit);

        return { posts, hasNextPage };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getPost = async (payload: GetPostPayload) => {
    try {
        const validatedFields = GetPostValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const { postId } = validatedFields.data;

        const session = await auth();
        const isSignedIn = !!(session?.user && session.user.id);
        const viewerId = isSignedIn ? session.user.id : undefined;
        const viewerIp = isSignedIn ? undefined : headers().get("x-forwarded-for") || "0.0.0.0";

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                creator: {
                    select: {
                        username: true,
                        image: true
                    }
                },
                poll: {
                    select: {
                        _count: {
                            select: {
                                votes: true
                            }
                        }
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
        });
        if (!post) return { error: "Post not found" };

        const alreadyViewed = await db.view.findFirst({
            where: {
                postId,
                viewerId,
                viewerIp
            }
        });
        if (!alreadyViewed) {
            await db.view.create({
                data: {
                    postId,
                    viewerId,
                    viewerIp
                }
            });
        }

        return post;
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};

export const getComments = async (payload: GetCommentsPayload) => {
    try {
        const validatedFields = GetCommentsValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };
        
        const session = await auth();

        const { postId, page, commentsLimit, repliesLimit, sort } = validatedFields.data;

        const comments = await db.comment.findMany({
            where: {
                postId
            },
            orderBy: {
                commentedAt: "asc"
            },
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

export const deleteComment = async (payload: DeleteCommentPayload) => {
    try {
        const validatedFields = DeleteCommentValidator.safeParse(payload);
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