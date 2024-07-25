import { z } from "zod";

export const GetBookmarkedPostsValidator = z.object({
    page: z.number(),
    limit: z.number(),
    sort: z.enum(["recent", "oldest"])
});

export const DeleteBookmarkValidator = z.object({
    bookmarkId: z.string()
});

export type GetBookmarkedPostsPayload = z.infer<typeof GetBookmarkedPostsValidator>;
export type DeleteBookmarkPayload = z.infer<typeof DeleteBookmarkValidator>;