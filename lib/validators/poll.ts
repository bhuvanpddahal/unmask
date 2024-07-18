import { z } from "zod";

export const VoteOnPollValidator = z.object({
    pollId: z.string(),
    pollOptionId: z.string()
});

export type VoteOnPollPayload = z.infer<typeof VoteOnPollValidator>;