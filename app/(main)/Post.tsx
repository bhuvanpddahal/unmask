import Link from "next/link";
import Image from "next/image";
import {
    Dot,
    Ellipsis,
    Eye,
    Heart,
    MessageSquare,
    Package2,
    Share
} from "lucide-react";
import { formatRelative } from "date-fns";
import { useRouter } from "next/navigation";

import UserAvatar from "@/components/UserAvatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/Card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

interface PostProps {
    creatorId: string;
    creatorUsername: string;
    creatorImage: string | null;
    postId: string;
    title: string;
    description: string;
    postImage: string | null;
    pollVotes?: number;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    lastPostRef?: (node?: Element | null) => void;
}

const Post = ({
    creatorId,
    creatorUsername,
    creatorImage,
    postId,
    title,
    description,
    postImage,
    pollVotes,
    createdAt,
    updatedAt,
    likesCount,
    commentsCount,
    viewsCount,
    lastPostRef
}: PostProps) => {
    const router = useRouter();

    return (
        <Card
            ref={lastPostRef}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/posts/${postId}`)}
        >
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
                                <span className="text-xs capitalize text-zinc-400 font-semibold">
                                   {formatRelative(createdAt, new Date())}
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
                                Copy link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-0">
                <h3 className="font-semibold text-accent-foreground line-clamp-1 mb-2">
                    {title}
                </h3>
                <p className="text-[13.5px] font-medium text-zinc-700 line-clamp-3">
                    {description}
                </p>
                {postImage && (
                    <div className="relative h-[350px] w-full border mt-4">
                        <Image
                            src={postImage}
                            alt="Post Image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                {pollVotes !== undefined && (
                    <div className="bg-accent px-5 py-3 flex items-center gap-x-3 rounded-md mt-4">
                        <div className="flex items-center gap-x-1 text-primary">
                            <Package2 className="size-4 text-primary" />
                            <span className="font-semibold text-[13.5px]">Poll</span>
                        </div>
                        <Separator orientation="vertical" className="bg-zinc-400 h-5" />
                        <p className="text-[13.5px] text-zinc-700 font-medium">
                            <span className="font-semibold">{pollVotes} </span>
                            Participants
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-6">
                <div className="w-full flex justify-between">
                    <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                            <Heart className="size-3" />
                            {likesCount}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                            <MessageSquare className="size-3" />
                            {commentsCount}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                            <Eye className="size-3" />
                            {viewsCount}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 rounded-full hover:bg-accent">
                        <Share className="size-3" />
                        Share
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
};

export default Post;

export const PostLoader = () => (
    <Card>
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
        <CardContent className="px-4 py-0">
            <div className="py-1 mb-2">
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="py-1 space-y-1.5">
                <Skeleton className="h-[13.5px] w-full" />
                <Skeleton className="h-[13.5px] w-full" />
                <Skeleton className="h-[13.5px] w-12" />
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-6">
            <div className="w-full flex justify-between">
                <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1 pl-2 pr-7 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <Heart className="size-3" />
                    </div>
                    <div className="flex items-center gap-1 pl-2 pr-8 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <MessageSquare className="size-3" />
                    </div>
                    <div className="flex items-center gap-1 pl-2 pr-9 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <Eye className="size-3" />
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 rounded-full hover:bg-accent">
                    <Share className="size-3" />
                    Share
                </div>
            </div>
        </CardFooter>
    </Card>
);