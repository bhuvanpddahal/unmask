import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { commentOnPost } from "@/actions/post";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";

interface CommentInputProps {
    postId: string;
}

const CommentInput = ({
    postId
}: CommentInputProps) => {
    const { toast } = useToast();
    const user = useCurrentUser();
    const { open } = useSigninModal();
    const queryClient = useQueryClient();
    const isSignedIn = !!(user && user.id);
    const [comment, setComment] = useState("");

    const {
        mutate: handleComment,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { postId, comment };
            const data = await commentOnPost(payload);
            return data;
        },
        onSuccess: (data) => {
            setComment("");
            toast({
                title: "Success",
                description: data.success
            });
            queryClient.invalidateQueries({
                queryKey: ["posts", postId]
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Failed to comment",
                description: error.message
            });
        }
    });

    return (
        <Card className="sticky bottom-0 p-4 mt-5">
            <div className="bg-zinc-50 border rounded-md">
                <Textarea
                    rows={2}
                    value={comment}
                    placeholder="Add a comment"
                    className="border-0 min-h-fit font-medium focus-visible:ring-0 focus-visible:ring-transparent"
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isPending}
                />
                <div className="text-right p-2">
                    <Button
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => setComment("")}
                    >
                        Clear
                    </Button>
                    <Button
                        isLoading={isPending}
                        disabled={isPending || comment.length < 3}
                        onClick={() => {
                            if (isSignedIn) handleComment();
                            else open();
                        }}
                    >
                        {isPending ? "Posting" : "Post"}
                    </Button>
                </div>
            </div>
        </Card>
    )
};

export default CommentInput;

export const CommentInputLoader = () => (
    <Card className="sticky bottom-0 p-4 mt-5">
        <Skeleton className="bg-zinc-100 w-full">
            <div className="h-[56px] w-full" />
            <div className="text-right p-2">
                <Skeleton className="bg-slate-200/50 inline-block h-9 w-[65px]" />
                <Skeleton className="bg-slate-200/50 inline-block h-9 w-[60px]" />
            </div>
        </Skeleton>
    </Card>
);