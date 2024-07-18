import { useState, useTransition } from "react";

import { useToast } from "./useToast";
import { voteOnPoll as voteOnPollAction } from "@/actions/poll";

export const useVoteOnPoll = (
    pollId: string,
    pollOptionId: string,
    initialPollVotesCount: number,
    hasAlreadyVoted: boolean
) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [pollVotesCount, setPollVotesCount] = useState(initialPollVotesCount);

    const voteOnPoll = () => {
        const payload = { pollId, pollOptionId };

        startTransition(() => {
            voteOnPollAction(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    if (!hasAlreadyVoted) setPollVotesCount((prev) => prev + 1);
                }
                if (data.error) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: data.error
                    });
                }
            });
        });
    };

    return {
        voteOnPoll,
        pollVotesCount,
        isPending
    };
};