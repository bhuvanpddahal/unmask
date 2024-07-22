import Link from "next/link";
import { format, formatRelative } from "date-fns";
import { Dot, Ellipsis, LinkIcon } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface PostHeaderProps {
    creatorId: string;
    creatorUsername: string;
    creatorImage: string | null;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostHeader = ({
    creatorId,
    creatorUsername,
    creatorImage,
    postId,
    createdAt,
    updatedAt
}: PostHeaderProps) => {
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
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent">
                        <Ellipsis className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-[13px] font-medium">
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/posts/${postId}`)}
                        >
                            <LinkIcon className="size-4 mr-2" />
                            Copy link
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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