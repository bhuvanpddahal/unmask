import { Package2 } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";

const Poll = () => {
    return (
        <div className="p-4 border rounded-md mt-4">
            <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1 text-primary">
                    <Package2 className="size-4 text-primary" />
                    <span className="font-semibold text-[13.5px]">Poll</span>
                </div>
                <Separator orientation="vertical" className="bg-zinc-400 h-5" />
                <p className="text-[13.5px] text-zinc-800 font-medium">
                    <span className="font-semibold">{"21"} </span>
                    Participants
                </p>
            </div>
            <div className="text-[13px] text-slate-500 my-3">
                Select only one answer
            </div>
            <ul className="space-y-2">
                {Array.from({ length: 3 }, (_, index) => (
                    <li
                        key={index}
                        className="bg-accent flex items-center gap-4  px-4 py-2.5 rounded-md"
                    >
                        <Input
                            type="radio"
                            className="size-5"
                        />
                        <p className="text-sm font-medium text-zinc-800">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, molestiae.
                        </p>
                    </li>
                ))}
            </ul>
            <div className="mt-4 space-y-2">
                <Button
                    size="lg"
                    className="w-full"
                >
                    Vote
                </Button>
                <Button
                    size="lg"
                    variant="ghost"
                    className="w-full"
                >
                    View Result
                </Button>
            </div>
        </div>
    )
};

export default Poll;