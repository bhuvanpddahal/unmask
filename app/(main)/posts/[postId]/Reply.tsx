import Link from "next/link";
import { Dot, Heart } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import { formatRelative } from "date-fns";

interface ReplyProps {
    replierId: string;
    replierUsername: string;
    replierImage: string | null;
    reply: string;
    likesCount: number;
    repliedAt: Date;
    updatedAt: Date;
}

const Reply = ({
    replierId,
    replierUsername,
    replierImage,
    reply,
    likesCount,
    repliedAt,
    updatedAt
}: ReplyProps) => {
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
                <div className="bg-zinc-100 p-4 rounded-md rounded-ss-none">
                    <div className="text-xs flex items-center gap-0.5">
                        <Link
                            href={`/users/${replierId}`}
                            className="text-zinc-500 font-semibold hover:underline"
                        >
                            {replierUsername}
                        </Link>
                        <Dot className="size-4 text-zinc-800" />
                        <span className="capitalize text-zinc-400 font-semibold">
                            {formatRelative(repliedAt, new Date())}
                            {new Date(updatedAt) > new Date(repliedAt) && " (Edited)"}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-800 font-medium mt-0.5">
                        {reply}
                    </p>
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