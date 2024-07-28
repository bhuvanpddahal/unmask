import Link from "next/link";
import { useState } from "react";
import { Dot } from "lucide-react";
import { format, formatRelative } from "date-fns";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

import ReplyEdit from "./ReplyEdit";
import ReplyOptions from "./ReplyOptions";
import UserAvatar from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";
import { useLikeOrUnlikeReply } from "@/hooks/useLikeOrUnlikeReply";

interface ReplyProps {
    postId: string;
    replyId: string;
    replierId: string;
    replierUsername: string;
    replierImage: string | null;
    reply: string;
    initialLikesCount: number;
    repliedAt: Date;
    updatedAt: Date;
    initialIsLiked: boolean;
}

const Reply = ({
    postId,
    replyId,
    replierId,
    replierUsername,
    replierImage,
    reply,
    initialLikesCount,
    repliedAt,
    updatedAt,
    initialIsLiked
}: ReplyProps) => {
    const currentUser = useCurrentUser();
    const isSameUser = currentUser?.id === replierId;
    const isSignedIn = !!(currentUser && currentUser.id);
    const isEdited = new Date(updatedAt) > new Date(repliedAt);
    const title = `Replied on ${format(repliedAt, "PPp")}${isEdited ? "\nLast edited on " + format(updatedAt, "PPp") : ""}`;
    const { open } = useSigninModal();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const {
        likeOrUnlikeReply,
        likesCount,
        isLiked
    } = useLikeOrUnlikeReply(
        replyId,
        initialLikesCount,
        initialIsLiked
    );

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
                <div className="relative bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md rounded-ss-none">
                    <div className="text-xs flex items-center gap-0.5">
                        <Link
                            href={`/users/${replierId}`}
                            className="text-zinc-500 dark:text-zinc-400 font-semibold hover:underline"
                        >
                            {replierUsername}
                        </Link>
                        <Dot className="size-4 text-zinc-800 dark:text-zinc-200" />
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
                        <p className="text-sm leading-6 text-zinc-800 dark:text-zinc-200 font-medium mt-0.5">
                            {reply}
                        </p>
                    )}
                </div>
                <div
                    className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm mt-2 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                    onClick={() => {
                        if (isSignedIn) likeOrUnlikeReply();
                        else open();
                    }}
                >
                    {isLiked ? (
                        <HiHeart className="size-4" />
                    ) : (
                        <HiOutlineHeart className="size-4" />
                    )}
                    {likesCount}
                </div>
            </div>
        </li>
    )
};

export default Reply;

export const ReplyLoader = () => (
    <li className="flex gap-2">
        <Skeleton className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        <div className="w-full">
            <Skeleton className="h-[74px] w-full bg-zinc-100 dark:bg-zinc-800 rounded-md rounded-ss-none" />
            <div className="flex items-center gap-x-3 mt-2">
                <div className="pl-2 pr-5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                    <HiOutlineHeart className="size-4" />
                </div>
            </div>
        </div>
    </li>
);