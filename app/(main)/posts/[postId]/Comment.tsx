import Link from "next/link";
import { useState } from "react";
import { Dot, Heart } from "lucide-react";
import { format, formatRelative } from "date-fns";

import ReplyInput from "./ReplyInput";
import CommentEdit from "./CommentEdit";
import CommentOptions from "./CommentOptions";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface CommentProps {
    postId: string;
    commentId: string;
    commenterId: string;
    commenterUsername: string;
    commenterImage: string | null;
    comment: string;
    likesCount: number;
    commentedAt: Date;
    updatedAt: Date;
}

const Comment = ({
    postId,
    commentId,
    commenterId,
    commenterUsername,
    commenterImage,
    comment,
    likesCount,
    commentedAt,
    updatedAt
}: CommentProps) => {
    const currentUser = useCurrentUser();
    const isSameUser = currentUser?.id === commenterId;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const isEdited = new Date(updatedAt) > new Date(commentedAt);
    const title = `Commented on ${format(commentedAt, "PPp")}${isEdited ? "\nLast edited on " + format(updatedAt, "PPp") : ""}`;

    return (
        <>
            <li className="flex items-start gap-2">
                <Link href={`/users/${commenterId}`}>
                    <UserAvatar
                        image={commenterImage}
                        username={commenterUsername}
                    />
                </Link>
                <div className="w-full">
                    <div className="relative bg-accent w-full p-4 rounded-md rounded-ss-none">
                        <div className="text-xs flex items-center gap-0.5">
                            <Link
                                href={`/users/${commenterId}`}
                                className="text-zinc-500 font-semibold hover:underline"
                            >
                                {commenterUsername}
                            </Link>
                            <Dot className="size-4 text-zinc-800" />
                            <span
                                title={title}
                                className="capitalize text-zinc-400 font-semibold"
                            >
                                {formatRelative(commentedAt, new Date())}
                                {isEdited && " (Edited)"}
                            </span>
                        </div>
                        {isSameUser && (
                            <CommentOptions
                                postId={postId}
                                commentId={commentId}
                                commenterUsername={commenterUsername}
                                comment={comment}
                                commentedAt={commentedAt}
                                isEdited={isEdited}
                                isEditOpen={isEditOpen}
                                setIsEditOpen={setIsEditOpen}
                            />
                        )}
                        {isEditOpen ? (
                            <CommentEdit
                                postId={postId}
                                commentId={commentId}
                                currentComment={comment}
                                setIsEditOpen={setIsEditOpen}
                            />
                        ) : (
                            <p className="text-sm text-zinc-800 font-medium mt-0.5">
                                {comment}
                            </p>
                        )}
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
                            onClick={() => setIsReplyOpen((prev) => !prev)}
                        >
                            {isReplyOpen ? "Close" : "Reply"}
                        </Button>
                    </div>
                </div>
            </li>
            {isReplyOpen && (
                <ReplyInput
                    postId={postId}
                    commentId={commentId}
                    setIsReplyOpen={setIsReplyOpen}
                />
            )}
        </>
    )
};

export default Comment;

export const CommentLoader = () => (
    <li className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="w-full">
            <Skeleton className="h-[70px] w-full rounded-md rounded-ss-none" />
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