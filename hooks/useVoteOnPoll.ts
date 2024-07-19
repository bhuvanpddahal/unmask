import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useToast } from "./useToast";
import { voteOnPoll as voteOnPollAction } from "@/actions/poll";

export const useVoteOnPoll = (
    postId: string,
    pollId: string,
    pollOptionId: string
) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const voteOnPoll = () => {
        const payload = { pollId, pollOptionId };

        startTransition(() => {
            voteOnPollAction(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["posts", postId]
                    });
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
        isPending
    };
};