import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "./useToast";
import { likeOrUnlikePost as likeOrUnlikePostAction } from "@/actions/post";

export const useLikeOrUnlikePost = (
    postId: string,
    initialLikesCount: number,
    initialIsLiked: boolean
) => {
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const { mutate: likeOrUnlikePost } = useMutation({
        mutationFn: async () => {
            const payload = { postId };
            await likeOrUnlikePostAction(payload);
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: `Failed to ${isLiked ? "like" : "unlike"} post`,
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
        likeOrUnlikePost,
        likesCount,
        isLiked
    };
};