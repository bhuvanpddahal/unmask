import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { useSigninModal } from "@/hooks/useSigninModal";
import { bookmarkOrUnbookmarkPost as bookmarkOrUnbookmarkPostAction } from "@/actions/bookmark";

interface BookmarkOptionProps {
    postId: string;
    isSignedIn: boolean;
    initialIsBookmarked: boolean;
}

const BookmarkOption = ({
    postId,
    isSignedIn,
    initialIsBookmarked
}: BookmarkOptionProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { open } = useSigninModal();
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

    const { mutate: bookmarkOrUnbookmarkPost } = useMutation({
        mutationFn: async () => {
            const payload = { postId };
            await bookmarkOrUnbookmarkPostAction(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: `Failed to ${isBookmarked ? "bookmark" : "unbookmark"} post`,
                description: error.message
            });

            if (isBookmarked) {
                setIsBookmarked(false);
            } else {
                setIsBookmarked(true);
            }
        },
        onMutate: () => {
            if (isBookmarked) {
                setIsBookmarked(false);
            } else {
                setIsBookmarked(true);
            }
        }
    });

    return (
        <div
            className="h-10 w-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-accent"
            onClick={() => {
                if (isSignedIn) bookmarkOrUnbookmarkPost();
                else open();
            }}
        >
            <Bookmark className={cn(
                "size-5",
                isBookmarked && "text-primary fill-primary"
            )} />
        </div>
    )
};

export default BookmarkOption;