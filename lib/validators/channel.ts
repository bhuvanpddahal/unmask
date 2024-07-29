import { z } from "zod";

export const UpsertChannelValidator = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long"
    }).max(30, {
        message: "Name cannot be more than 30 characters long"
    }),
    description: z.union([
        z.undefined(),
        z.string().max(120, {
            message: "Description cannot be more than 120 characters long"
        })
    ]),
    type: z.enum(["academics", "career", "personal_development", "campus_life", "general", "technology", "industry", "creative_arts", "social_issues"]),
    bannerImage: z.string().optional(),
    profileImage: z.string().optional(),
    visibility: z.enum(["private", "public"])
});

export const ChannelIdValidator = z.object({
    channelId: z.string()
});

export type UpsertChannelPayload = z.infer<typeof UpsertChannelValidator>;
export type ChannelIdPayload = z.infer<typeof ChannelIdValidator>;