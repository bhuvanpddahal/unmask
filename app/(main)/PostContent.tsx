import Image from "next/image";
import { Package2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

interface PostContentProps {
    title: string;
    description: string;
    postImage: string | null;
    pollVotes?: number;
}

const PostContent = ({
    title,
    description,
    postImage,
    pollVotes
}: PostContentProps) => {
    const router = useRouter();

    return (
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
    )
};

export default PostContent;

export const PostContentLoader = () => (
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
);