import { z } from "zod";

export const ReplyOnCommentValidator = z.object({
    commentId: z.string(),
    reply: z.string().min(3)
});

export const EditReplyValidator = z.object({
    replyId: z.string(),
    editedReply: z.string().min(3)
});

export const ReplyIdValidator = z.object({
    replyId: z.string()
});

export const GetMoreRepliesValidator = z.object({
    commentId: z.string(),
    page: z.number(),
    limit: z.number(),
    repliesPerPage: z.number()
});

export type ReplyOnCommentPayload = z.infer<typeof ReplyOnCommentValidator>;
export type EditReplyPayload = z.infer<typeof EditReplyValidator>;
export type ReplyIdPayload = z.infer<typeof ReplyIdValidator>;
export type GetMoreRepliesPayload = z.infer<typeof GetMoreRepliesValidator>;