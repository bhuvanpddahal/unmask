import { ImagePlus, Rows3 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import Logo from "@/components/Logo";
import {
    Button,
    buttonVariants
} from "@/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";

interface NavbarProps {
    mode: "create" | "edit";
    hasImage: boolean;
    hasPoll: boolean;
    setHasPoll: Dispatch<SetStateAction<boolean>>;
    follows: {
        channel: {
            id: string;
            name: string;
        };
    }[];
    channelId: string | undefined;
    setChannelId?: Dispatch<SetStateAction<string | undefined>>;
}

const Navbar = ({
    mode,
    hasImage,
    hasPoll,
    setHasPoll,
    follows,
    channelId,
    setChannelId
}: NavbarProps) => {
    return (
        <nav className="sticky top-0 h-[60px] bg-card px-4 py-2 shadow-lg dark:shadow-slate-800 z-10">
            <div className="max-w-[1400px] w-full h-full mx-auto flex items-center justify-between">
                <Logo />
                <div className="flex">
                    <Label
                        htmlFor="image-input"
                        className={cn(buttonVariants({
                            variant: "ghost",
                            className: cn(
                                "gap-x-1",
                                hasImage ? "opacity-50 pointer-events-none" : "cursor-pointer"
                            )
                        }))}
                    >
                        <ImagePlus className="size-4" />
                        Add Image
                    </Label>
                    <Button
                        variant="ghost"
                        className="gap-x-1"
                        onClick={() => setHasPoll(true)}
                        disabled={hasPoll}
                    >
                        <Rows3 className="size-4" />
                        Add Poll
                    </Button>
                    {follows.length > 0 && (
                        <Select
                            value={channelId}
                            onValueChange={setChannelId}
                            disabled={mode === "edit"}
                        >
                            <SelectTrigger className="h-9 w-fit">
                                <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                                {follows.map((follow) => (
                                    <SelectItem key={follow.channel.id} value={follow.channel.id}>
                                        {follow.channel.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

export const NavbarLoader = () => (
    <nav className="sticky top-0 h-[60px] bg-card px-4 py-2 shadow-lg z-10">
        <div className="max-w-[1400px] w-full h-full mx-auto flex items-center justify-between">
            <Logo />
            <div className="flex">
                <Skeleton className="h-9 w-[120px]" />
                <Skeleton className="h-9 w-[102px]" />
            </div>
        </div>
    </nav>
);