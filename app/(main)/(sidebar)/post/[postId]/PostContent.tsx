import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

import Poll from "../../Poll";
import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export interface PollOption {
    id: string;
    option: string;
    _count: {
        votes: number;
    };
    votes: {
        voterId: string;
    }[];
}

interface PostContentProps {
    postId: string;
    title: string;
    description: string;
    postImage: string | null;
    poll: {
        id: string;
        options: PollOption[];
    } | null;
}

const PostContent = ({
    postId,
    title,
    description,
    postImage,
    poll
}: PostContentProps) => {
    return (
        <CardContent className="px-4 py-0">
            <h3 className="font-semibold text-xl text-black dark:text-white mb-2">
                {title}
            </h3>
            <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
                className="text-sm leading-6 font-medium text-zinc-800 dark:text-zinc-200 [&_p]:min-h-4"
            />
            {postImage && (
                <div className="relative h-[350px] w-full border mt-4">
                    <Image
                        src={postImage}
                        alt="Post Image"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            )}
            {poll && (
                <Poll
                    postId={postId}
                    pollId={poll.id}
                    pollOptions={poll.options}
                />
            )}
        </CardContent>
    );
};

export default PostContent;

export const PostContentLoader = () => (
    <CardContent className="px-4 py-0">
        <div className="py-1 mb-2">
            <Skeleton className="h-5 w-[300px]" />
        </div>
        <div className="py-[5px] space-y-2.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-20" />
        </div>
    </CardContent>
);