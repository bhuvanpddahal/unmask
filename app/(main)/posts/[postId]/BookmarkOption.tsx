import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { bookmarkOrUnbookmarkPost as bookmarkOrUnbookmarkPostAction } from "@/actions/bookmark";

interface BookmarkOptionProps {
    postId: string;
    initialIsBookmarked: boolean;
}

const BookmarkOption = ({
    postId,
    initialIsBookmarked
}: BookmarkOptionProps) => {
    const { toast } = useToast();
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

    const { mutate: bookmarkOrUnbookmarkPost } = useMutation({
        mutationFn: async () => {
            const payload = { postId };
            await bookmarkOrUnbookmarkPostAction(payload);
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
            onClick={() => bookmarkOrUnbookmarkPost()}
        >
            <Bookmark className={cn(
                "size-5",
                isBookmarked && "text-primary fill-primary"
            )} />
        </div>
    )
};

export default BookmarkOption;