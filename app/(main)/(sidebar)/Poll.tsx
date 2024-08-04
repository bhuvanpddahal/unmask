import Link from "next/link";
import { useState } from "react";
import { Package2 } from "lucide-react";

import PollResult from "./PollResult";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import { POLL_OPTIONS_PER_POST } from "@/constants";
import { Separator } from "@/components/ui/Separator";
import { useVoteOnPoll } from "@/hooks/useVoteOnPoll";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";
import { PollOption } from "./post/[postId]/PostContent";
import { Button, buttonVariants } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

interface PollProps {
    postId: string;
    pollId: string;
    pollOptions: PollOption[];
    insidePolls?: boolean;
}

const Poll = ({
    postId,
    pollId,
    pollOptions,
    insidePolls = false
}: PollProps) => {
    const user = useCurrentUser();
    const isSignedIn = !!(user && user.id);
    const pollResultData = pollOptions.map((option) => ({
        id: option.id,
        option: option.option,
        votesCount: option._count.votes
    }));
    const votedOption = pollOptions.find((option) => {
        return option.votes.length && option.votes[0].voterId === user?.id;
    });
    const pollVotesCount = pollOptions.reduce((acc, option) => {
        return acc + option._count.votes;
    }, 0);
    const slicedPollOptions = pollOptions.slice(0, POLL_OPTIONS_PER_POST);
    const slicedPollResultData = pollResultData.slice(0, POLL_OPTIONS_PER_POST);
    const hasMorePollOptions = pollOptions.length > POLL_OPTIONS_PER_POST;
    const morePollOptionsCount = pollOptions.length - POLL_OPTIONS_PER_POST;
    const { open } = useSigninModal();
    const [activePollOptionId, setActivePollOptionId] = useState<string | undefined>(votedOption?.id);

    const {
        voteOnPoll,
        isPending
    } = useVoteOnPoll(
        postId,
        pollId,
        activePollOptionId || ""
    );

    return (
        <div
            className="p-4 border rounded-md mt-4 cursor-default"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1 text-primary">
                    <Package2 className="size-4 text-primary" />
                    <span className="font-semibold text-[13.5px]">Poll</span>
                </div>
                <Separator orientation="vertical" className="bg-zinc-400 h-5" />
                <p className="text-[13.5px] text-zinc-800 dark:text-zinc-200 font-medium">
                    <span className="font-semibold">{pollVotesCount} </span>
                    {pollVotesCount === 1 ? "Participant" : "Participants"}
                </p>
            </div>
            <div className="text-[13px] text-slate-500 my-3">
                Select only one answer
            </div>
            <RadioGroup
                defaultValue={activePollOptionId}
                onValueChange={setActivePollOptionId}
            >
                {(insidePolls ? slicedPollOptions : pollOptions).map((option, index) => (
                    <Label
                        key={option.id}
                        htmlFor={`option-${index}`}
                        className="bg-accent flex items-center gap-4 px-4 py-2.5 rounded-md cursor-pointer"
                    >
                        <RadioGroupItem
                            value={option.id}
                            id={`option-${index}`}
                            className="shrink-0 size-[18px] border-black dark:border-white text-black dark:text-white focus-visible:ring-0 focus-visible:ring-transparent"
                        />
                        <p className="text-[13.5px] leading-[20px] text-zinc-800 dark:text-zinc-200 cursor-pointer">
                            {option.option}
                        </p>
                    </Label>
                ))}
            </RadioGroup>
            {insidePolls && hasMorePollOptions && (
                <Link
                    href={`/post/${postId}`}
                    className={cn(buttonVariants({
                        variant: "link",
                        className: "h-fit w-fit p-0 mt-4 text-black dark:text-white font-semibold hover:text-accent-foreground"
                    }))}
                >
                    View {morePollOptionsCount} more {morePollOptionsCount === 1 ? "option" : "options"}
                </Link>
            )}
            <div className="mt-4 space-y-2">
                <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                        if (isSignedIn) voteOnPoll();
                        else open();
                    }}
                    isLoading={isPending}
                    disabled={!activePollOptionId || isPending}
                >
                    {isPending ? "Voting" : "Vote"}
                </Button>
                {isSignedIn ? (
                    <PollResult
                        data={insidePolls ? slicedPollResultData : pollResultData}
                        totalVotes={pollVotesCount}
                        votedOptionId={votedOption?.id}
                        hasMorePollOptions={hasMorePollOptions}
                        morePollOptionsCount={morePollOptionsCount}
                        insidePolls={insidePolls}
                    />
                ) : (
                    <Button
                        size="lg"
                        variant="ghost"
                        className="w-full"
                        onClick={open}
                    >
                        View Result
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Poll;

export const PollLoader = () => (
    <div className="p-4 border rounded-md mt-4 cursor-default">
        <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-x-1 text-primary">
                <Package2 className="size-4 text-primary" />
                <span className="font-semibold text-[13.5px]">Poll</span>
            </div>
            <Separator orientation="vertical" className="bg-zinc-400 h-5" />
            <Skeleton className="h-[13.5px] w-[100px]" />
        </div>
        <div className="my-3 py-[3.25px]">
            <Skeleton className="h-[13px] w-[140px]" />
        </div>
        <RadioGroup className="pointer-events-none">
            {Array.from({ length: 2 }, (_, index) => (
                <div
                    key={index}
                    className="bg-accent h-10 flex items-center rounded-md"
                >
                    <RadioGroupItem
                        value={`option-${index}`}
                        className="shrink-0 size-[18px] border-black dark:border-white text-black dark:text-white focus-visible:ring-0 focus-visible:ring-transparent"
                    />
                </div>
            ))}
        </RadioGroup>
        <div className="mt-4 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);