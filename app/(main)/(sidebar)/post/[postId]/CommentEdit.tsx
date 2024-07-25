import {
    Dispatch,
    SetStateAction,
    useState
} from "react";
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { editComment } from "@/actions/comment";
import { Textarea } from "@/components/ui/Textarea";

interface CommentEditProps {
    postId: string;
    commentId: string;
    currentComment: string;
    setIsEditOpen: Dispatch<SetStateAction<boolean>>;
}

const CommentEdit = ({
    postId,
    commentId,
    currentComment,
    setIsEditOpen
}: CommentEditProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [comment, setComment] = useState(currentComment);

    const {
        mutate: handleEditComment,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { commentId, editedComment: comment };
            const data = await editComment(payload);
            return data;
        },
        onSuccess: (data) => {
            setIsEditOpen(false);
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
                title: "Failed to edit comment",
                description: error.message
            });
        }
    });

    return (
        <div className="mt-3 bg-white border rounded-md">
            <Textarea
                rows={2}
                value={comment}
                placeholder="Edit comment"
                className="bg-white leading-6 border-0 min-h-fit font-medium focus-visible:ring-0 focus-visible:ring-transparent"
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
                    onClick={() => handleEditComment()}
                >
                    {isPending ? "Editing" : "Edit"}
                </Button>
            </div>
        </div>
    )
};

export default CommentEdit;