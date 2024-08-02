import Poll, { PollLoader } from "../Poll";
import { Poll as PollType } from "./Post";
import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface PostContentProps {
    postId: string;
    title: string;
    description: string;
    poll: PollType;
}

const PostContent = ({
    postId,
    title,
    description,
    poll
}: PostContentProps) => {
    return (
        <CardContent className="px-4 py-0">
            <h3 className="font-semibold text-accent-foreground line-clamp-1 mb-2">
                {title}
            </h3>
            <p className="text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300 line-clamp-3">
                {description}
            </p>
            {poll && (
                <Poll
                    key={poll.id}
                    postId={postId}
                    pollId={poll.id}
                    pollOptions={poll.options}
                    insidePolls
                />
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
            <Skeleton className="h-[13.5px] w-20" />
        </div>
        <PollLoader />
    </CardContent>
);