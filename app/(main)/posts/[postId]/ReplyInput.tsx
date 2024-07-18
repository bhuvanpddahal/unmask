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
import { replyOnComment } from "@/actions/reply";
import { Textarea } from "@/components/ui/Textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";

interface ReplyInputProps {
    postId: string;
    commentId: string;
    setIsReplyOpen: Dispatch<SetStateAction<boolean>>;
}

const ReplyInput = ({
    postId,
    commentId,
    setIsReplyOpen
}: ReplyInputProps) => {
    const { toast } = useToast();
    const user = useCurrentUser();
    const { open } = useSigninModal();
    const queryClient = useQueryClient();
    const isSignedIn = !!(user && user.id);
    const [reply, setReply] = useState("");

    const {
        mutate: handleReply,
        isPending
    } = useMutation({
        mutationFn: async () => {
            const payload = { commentId, reply };
            const data = await replyOnComment(payload);
            return data;
        },
        onSuccess: (data) => {
            setIsReplyOpen(false);
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
                title: "Failed to reply",
                description: error.message
            });
        }
    });

    return (
        <div className="ml-[92px] mt-3 bg-zinc-50 border rounded-md">
            <Textarea
                rows={2}
                value={reply}
                placeholder="Add a reply"
                className="border-0 min-h-fit font-medium focus-visible:ring-0 focus-visible:ring-transparent"
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
                    onClick={() => {
                        if (isSignedIn) handleReply();
                        else open();
                    }}
                >
                    {isPending ? "Replying" : "Reply"}
                </Button>
            </div>
        </div>
    )
};

export default ReplyInput;