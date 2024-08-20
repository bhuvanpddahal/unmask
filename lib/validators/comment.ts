import { z } from "zod";

export const GetCommentsValidator = z.object({
    postId: z.string(),
    page: z.number(),
    commentsLimit: z.number(),
    repliesLimit: z.number(),
    sort: z.enum(["oldest", "newest", "top"])
});

export const CommentOnPostValidator = z.object({
    postId: z.string(),
    comment: z.string().min(3)
});

export const EditCommentValidator = z.object({
    commentId: z.string(),
    editedComment: z.string().min(3)
});

export const CommentIdValidator = z.object({
    commentId: z.string()
});

export type GetCommentsPayload = z.infer<typeof GetCommentsValidator>;
export type CommentOnPostPayload = z.infer<typeof CommentOnPostValidator>;
export type EditCommentPayload = z.infer<typeof EditCommentValidator>;
export type CommentIdPayload = z.infer<typeof CommentIdValidator>;