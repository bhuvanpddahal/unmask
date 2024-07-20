import { z } from "zod";

export const UpsertPostValidator = z.object({
    id: z.string().optional(),
    title: z.string().min(10, {
        message: "Title must be at least 10 characters long"
    }),
    description: z.string().min(40, {
        message: "Description must be at least 40 characters long"
    }),
    image: z.string().optional(),
    pollOptions: z.array(z.string()).min(2, {
        message: "Poll must have at least 2 options"
    }).max(6, {
        message: "Poll must have at most 6 options"
    }).optional().refine((options) => {
        if (!options) return true;
        const hasEmptyOption = options.findIndex((option) => option === "");
        if (hasEmptyOption === -1) return true;
        return false;
    }, {
        message: "Option cannot be empty"
    })
});

export const GetPostsValidator = z.object({
    page: z.number(),
    limit: z.number(),
    sort: z.enum(["hot", "recent", "views"]),
});

export const GetPostValidator = z.object({
    postId: z.string()
});

export const LikeOrUnlikePostValidator = z.object({
    postId: z.string()
});

export const DeletePostValidator = z.object({
    postId: z.string()
});

export type UpsertPostPayload = z.infer<typeof UpsertPostValidator>;
export type GetPostsPayload = z.infer<typeof GetPostsValidator>;
export type GetPostPayload = z.infer<typeof GetPostValidator>;
export type LikeOrUnlikePostPayload = z.infer<typeof LikeOrUnlikePostValidator>;
export type DeletePostPayload = z.infer<typeof DeletePostValidator>;