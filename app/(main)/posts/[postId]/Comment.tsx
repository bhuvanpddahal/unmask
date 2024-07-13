import { Heart } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

interface CommentProps {
    commenterUsername: string;
    commenterImage: string | null;
    comment: string;
    likesCount: number;
}

const Comment = ({
    commenterUsername,
    commenterImage,
    comment,
    likesCount
}: CommentProps) => {
    return (
        <li className="flex gap-2">
            <UserAvatar
                image={commenterImage}
                username={commenterUsername}
            />
            <div className="w-full">
                <div className="bg-accent w-full p-4 rounded-md rounded-ss-none">
                    <p className="text-sm text-zinc-800 font-medium">
                        {comment}
                    </p>
                </div>
                <div className="flex items-center gap-x-3 mt-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-sm rounded-full hover:bg-accent">
                        <Heart className="size-3" />
                        {likesCount}
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <Button
                        size="sm"
                        className="bg-transparent p-0 border-0 text-black font-semibold hover:bg-transparent hover:text-accent-foreground"
                    >
                        Reply
                    </Button>
                </div>
            </div>
        </li>
    )
};

export default Comment;

export const CommentLoader = () => (
    <li className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="w-full">
            <Skeleton className="h-[72px] w-full rounded-md rounded-ss-none" />
            <div className="flex items-center gap-x-3 mt-2">
                <div className="pl-2 pr-7 py-1 bg-zinc-100 rounded-full">
                    <Heart className="size-3" />
                </div>
                <Separator orientation="vertical" className="h-5" />
                <Button
                    size="sm"
                    className="bg-transparent p-0 border-0 text-black font-semibold pointer-events-none"
                >
                    Reply
                </Button>
            </div>
        </div>
    </li>
);