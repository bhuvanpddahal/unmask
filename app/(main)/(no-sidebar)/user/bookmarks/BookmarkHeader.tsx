import { X } from "lucide-react";
import { useTransition } from "react";
import { format, formatRelative } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { deleteBookmark } from "@/actions/bookmark";

interface BookmarkHeaderProps {
    bookmarkId: string;
    bookmarkedAt: Date;
}

const BookmarkHeader = ({
    bookmarkId,
    bookmarkedAt
}: BookmarkHeaderProps) => {
    const queryClient = useQueryClient();
    const title = `Bookmarked on ${format(bookmarkedAt, "PPp")}`;
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDeleteBookmark = () => {
        const payload = { bookmarkId };

        startTransition(() => {
            deleteBookmark(payload).then((data) => {
                if (data.success) {
                    toast({
                        title: "Success",
                        description: data.success
                    });
                    queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] });
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

    return (
        <div className="flex items-center justify-between border-b p-2 pl-3">
            <p
                title={title}
                className="text-xs capitalize text-zinc-400 font-semibold"
            >
                {formatRelative(bookmarkedAt, new Date())}
            </p>
            <Button
                variant="destructive"
                className="h-7 w-7 p-0"
                onClick={handleDeleteBookmark}
                isLoading={isPending}
            >
                {!isPending && <X className="size-4" />}
            </Button>
        </div>
    )
};

export default BookmarkHeader;

export const BookmarkHeaderLoader = () => (
    <div className="flex items-center justify-between border-b p-2 pl-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="size-7" />
    </div>
);