import {
    Dispatch,
    SetStateAction,
    useState
} from "react";
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import { editReply } from "@/actions/post";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface ReplyEditProps {
    postId: string;
    replyId: string;
    currentReply: string;
    setIsEditOpen: Dispatch<SetStateAction<boolean>>;
}

const ReplyEdit = ({
    postId,
    replyId,
    currentReply,
    setIsEditOpen
}: ReplyEditProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [reply, setReply] = useState(currentReply);

    const {
        mutate: handleEditComment,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { replyId, editedReply: reply };
            const data = await editReply(payload);
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
                title: "Failed to edit reply",
                description: error.message
            });
        }
    });

    return (
        <div className="mt-3 bg-white border rounded-md">
            <Textarea
                rows={2}
                value={reply}
                placeholder="Edit reply"
                className="bg-white border-0 min-h-fit font-medium focus-visible:ring-0 focus-visible:ring-transparent"
                onChange={(e) => setReply(e.target.value)}
                disabled={isPending}
            />
            <div className="text-right p-2">
                <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => setReply("")}
                >
                    Clear
                </Button>
                <Button
                    isLoading={isPending}
                    disabled={isPending || reply.length < 3}
                    onClick={() => handleEditComment()}
                >
                    {isPending ? "Editing" : "Edit"}
                </Button>
            </div>
        </div>
    )
};

export default ReplyEdit;