"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import {
    VoteOnPollPayload,
    VoteOnPollValidator
} from "@/lib/validators/poll";

export const voteOnPoll = async (payload: VoteOnPollPayload) => {
    try {
        const validatedFields = VoteOnPollValidator.safeParse(payload);
        if (!validatedFields.success) return { error: "Invalid fields" };

        const session = await auth();
        if (!session?.user || !session.user.id) return { error: "Unauthorized" };

        const { pollId, pollOptionId } = validatedFields.data;

        const poll = await db.poll.findUnique({
            where: {
                id: pollId
            },
            select: {
                options: {
                    where: {
                        id: pollOptionId
                    },
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!poll) return { error: "Poll not found" };
        if (!poll.options.length || poll.options[0].id !== pollOptionId) return { error: "Invalid poll option id" };

        const previousVote = await db.pollOptionVote.findFirst({
            where: {
                voterId: session.user.id,
                pollOption: {
                    pollId
                }
            }
        });

        if (previousVote) {
            if (previousVote.pollOptionId === pollOptionId) return { error: "Already voted for the option" };

            await db.pollOptionVote.delete({
                where: {
                    id: previousVote.id
                }
            });
        }
        
        await db.pollOptionVote.create({
            data: {
                pollOptionId,
                voterId: session.user.id
            }
        });

        return { success: "Voted on poll successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
};