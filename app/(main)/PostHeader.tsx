import Link from "next/link";
import { Dot } from "lucide-react";
import { format, formatRelative } from "date-fns";

import PostOptions from "./PostOptions";
import UserAvatar from "@/components/UserAvatar";
import { CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface PostHeaderProps {
    creatorId: string;
    creatorUsername: string;
    creatorImage: string | null;
    postId: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostHeader = ({
    creatorId,
    creatorUsername,
    creatorImage,
    postId,
    title,
    description,
    createdAt,
    updatedAt
}: PostHeaderProps) => {
    const currentUser = useCurrentUser();
    const isSameUser = currentUser?.id === creatorId;
    const isEdited = new Date(updatedAt) > new Date(createdAt);
    const dateTitle = `Posted on ${format(createdAt, "PPp")}${isEdited ? "\nLast edited on " + format(updatedAt, "PPp") : ""}`;

    return (
        <CardHeader className="p-4">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <UserAvatar
                        image={creatorImage}
                        username={creatorUsername}
                    />
                    <div>
                        <p className="text-[13px] flex items-center gap-0.5">
                            <Link
                                href={`/users/${creatorId}`}
                                className="text-accent-foreground font-semibold hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {creatorUsername}
                            </Link>
                            <Dot className="size-4" />
                            <span
                                title={dateTitle}
                                className="text-xs capitalize text-zinc-400 font-semibold"
                            >
                                {formatRelative(createdAt, new Date())}
                                {isEdited && " (Edited)"}
                            </span>
                        </p>
                    </div>
                </div>
                <PostOptions
                    postId={postId}
                    isSameUser={isSameUser}
                    creatorUsername={creatorUsername}
                    creatorImage={creatorImage}
                    title={title}
                    description={description}
                    isEdited={isEdited}
                    createdAt={createdAt}
                />
            </div>
        </CardHeader>
    )
};

export default PostHeader;

export const PostHeaderLoader = () => (
    <CardHeader className="p-4">
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex items-center gap-0.5">
                    <Skeleton className="h-[13px] w-[55px]" />
                    <Dot className="size-4" />
                    <Skeleton className="h-3 w-[55px]" />
                </div>
            </div>
            <div className="p-[10px]">
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
        </div>
    </CardHeader>
);