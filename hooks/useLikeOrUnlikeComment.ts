import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "./useToast";
import { likeOrUnlikeComment as likeOrUnlikeCommentAction } from "@/actions/comment";

export const useLikeOrUnlikeComment = (
    commentId: string,
    initialLikesCount: number,
    initialIsLiked: boolean
) => {
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const { mutate: likeOrUnlikeComment } = useMutation({
        mutationFn: async () => {
            const payload = { commentId };
            await likeOrUnlikeCommentAction(payload);
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: `Failed to ${isLiked ? "like" : "unlike"} comment`,
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
        likeOrUnlikeComment,
        likesCount,
        isLiked
    };
};