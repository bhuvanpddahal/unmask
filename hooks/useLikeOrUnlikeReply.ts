import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "./useToast";
import { likeOrUnlikeReply as likeOrUnlikeReplyAction } from "@/actions/post";

export const useLikeOrUnlikeReply = (
    replyId: string,
    initialLikesCount: number,
    initialIsLiked: boolean
) => {
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const { mutate: likeOrUnlikeReply } = useMutation({
        mutationFn: async () => {
            const payload = { replyId };
            await likeOrUnlikeReplyAction(payload);
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: `Failed to ${isLiked ? "like" : "unlike"} reply`,
                description: error.message
            });

            if (isLiked) {
                setIsLiked(false);
                setLikesCount((prev) => prev - 1);
            } else {
                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        },
        onMutate: () => {
            if (isLiked) {
                setIsLiked(false);
                setLikesCount((prev) => prev - 1);
            } else {
                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        }
    });

    return {
        likeOrUnlikeReply,
        likesCount,
        isLiked
    };
};