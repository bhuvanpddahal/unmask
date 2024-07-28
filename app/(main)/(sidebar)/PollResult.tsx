import { Circle, CircleCheckBig } from "lucide-react";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

interface PollResultProps {
    data: {
        id: string;
        option: string;
        votesCount: number;
    }[];
    totalVotes: number;
    votedOptionId?: string;
    hasMorePollOptions: boolean;
    morePollOptionsCount: number;
    insidePolls: boolean;
}

const PollResult = ({
    data,
    totalVotes,
    votedOptionId,
    hasMorePollOptions,
    morePollOptionsCount,
    insidePolls
}: PollResultProps) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    className="w-full"
                >
                    View Result
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>Poll Result</DrawerTitle>
                        <DrawerDescription>View the result of the poll.</DrawerDescription>
                    </DrawerHeader>
                    <ul className="space-y-2">
                        {data.map((option, index) => {
                            const isVoted = votedOptionId === option.id;
                            const percentValue = totalVotes === 0 ? 0 : (option.votesCount / totalVotes) * 100;

                            return (
                                <div
                                    key={index}
                                    className="relative bg-accent px-4 py-2.5 rounded-md"
                                >
                                    <div className="relative flex items-center justify-between gap-4 z-10">
                                        <div className="flex items-center gap-4">
                                            {isVoted ? (
                                                <CircleCheckBig className="size-[18px]" />
                                            ) : (
                                                <Circle className="size-[18px]" />
                                            )}
                                            <p className="text-[13.5px] leading-[22px] text-zinc-800 dark:text-zinc-200 font-medium">
                                                {option.option}
                                            </p>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-x-1">
                                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                                {Math.trunc(percentValue) === percentValue
                                                    ? percentValue : percentValue.toFixed(2)
                                                }%
                                            </span>
                                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                                ({option.votesCount} {option.votesCount === 1 ? "vote" : "votes"})
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={percentValue}
                                        className="absolute top-0 left-0 h-full w-full opacity-35"
                                    />
                                </div>
                            )
                        })}
                        {insidePolls && hasMorePollOptions && (
                            <p className="px-4 text-[13.5px] leading-[22px] font-medium text-slate-500">
                                {morePollOptionsCount} options are hidden
                            </p>
                        )}
                    </ul>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" size="lg" className="w-full">
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>

    )
};

export default PollResult;