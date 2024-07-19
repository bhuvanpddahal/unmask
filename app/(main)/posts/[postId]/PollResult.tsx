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
}

const PollResult = ({
    data,
    totalVotes,
    votedOptionId
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
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader>
                        <DrawerTitle>Poll Result</DrawerTitle>
                        <DrawerDescription>View the result of the poll.</DrawerDescription>
                    </DrawerHeader>
                    <ul className="space-y-2">
                        {data.map((option, index) => {
                            const isVoted = votedOptionId === option.id;
                            const percentValue = (option.votesCount / totalVotes) * 100;

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
                                            <p className="text-sm text-zinc-800 font-medium">
                                                {option.option}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-zinc-800 font-semibold">
                                            {percentValue}% ({option.votesCount} {option.votesCount === 1 ? "vote" : "votes"})
                                        </span>
                                    </div>
                                    <Progress
                                        value={percentValue}
                                        className="absolute top-0 left-0 h-full w-full opacity-35"
                                    />
                                </div>
                            )
                        })}
                    </ul>
                    <DrawerFooter>
                        <DrawerClose>
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