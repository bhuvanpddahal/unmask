import Link from "next/link";
import { useState } from "react";
import { Dot, Heart } from "lucide-react";
import { format, formatRelative } from "date-fns";

import ReplyEdit from "./ReplyEdit";
import ReplyOptions from "./ReplyOptions";
import UserAvatar from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ReplyProps {
    postId: string;
    replyId: string;
    replierId: string;
    replierUsername: string;
    replierImage: string | null;
    reply: string;
    likesCount: number;
    repliedAt: Date;
    updatedAt: Date;
}

const Reply = ({
    postId,
    replyId,
    replierId,
    replierUsername,
    replierImage,
    reply,
    likesCount,
    repliedAt,
    updatedAt
}: ReplyProps) => {
    const currentUser = useCurrentUser();
    const isSameUser = currentUser?.id === replierId;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isEdited = new Date(updatedAt) > new Date(repliedAt);
    const title = `Replied on ${format(repliedAt, "PPp")}${isEdited ? "\nLast edited on " + format(updatedAt, "PPp") : ""}`;

    return (
        <li className="flex items-start gap-2">
            <Link href={`/users/${replierId}`}>
                <UserAvatar
                    image={replierImage}
                    username={replierUsername}
                    className="size-8"
                />
            </Link>
            <div className="w-full">
                <div className="relative bg-zinc-100 p-4 rounded-md rounded-ss-none">
                    <div className="text-xs flex items-center gap-0.5">
                        <Link
                            href={`/users/${replierId}`}
                            className="text-zinc-500 font-semibold hover:underline"
                        >
                            {replierUsername}
                        </Link>
                        <Dot className="size-4 text-zinc-800" />
                        <span
                            title={title}
                            className="capitalize text-zinc-400 font-semibold"
                        >
                            {formatRelative(repliedAt, new Date())}
                            {isEdited && " (Edited)"}
                        </span>
                    </div>
                    {isSameUser && (
                        <ReplyOptions
                            postId={postId}
                            replyId={replyId}
                            replierUsername={replierUsername}
                            reply={reply}
                            repliedAt={repliedAt}
                            isEdited={isEdited}
                            isEditOpen={isEditOpen}
                            setIsEditOpen={setIsEditOpen}
                        />
                    )}
                    {isEditOpen ? (
                        <ReplyEdit
                            postId={postId}
                            replyId={replyId}
                            currentReply={reply}
                            setIsEditOpen={setIsEditOpen}
                        />
                    ) : (
                        <p className="text-sm text-zinc-800 font-medium mt-0.5">
                            {reply}
                        </p>
                    )}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-sm mt-2 rounded-full hover:bg-accent">
                    <Heart className="size-3" />
                    {likesCount}
                </div>
            </div>
        </li>
    )
};

export default Reply;

export const ReplyLoader = () => (
    <li className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="w-full">
            <Skeleton className="h-[70px] w-full rounded-md rounded-ss-none" />
            <div className="flex items-center gap-x-3 mt-2">
                <div className="pl-2 pr-7 py-1 bg-zinc-100 rounded-full">
                    <Heart className="size-3" />
                </div>
            </div>
        </div>
    </li>
);