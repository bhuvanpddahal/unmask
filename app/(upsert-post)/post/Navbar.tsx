import Link from "next/link";
import Image from "next/image";
import { ImagePlus, Rows3 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import {
    Button,
    buttonVariants
} from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";

interface NavbarProps {
    hasImage: boolean;
    hasPoll: boolean;
    setHasPoll: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({
    hasImage,
    hasPoll,
    setHasPoll
}: NavbarProps) => {
    return (
        <nav className="sticky top-0 h-[60px] bg-card px-4 py-2 shadow-lg z-10">
            <div className="max-w-[1400px] w-full h-full mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center justify-center"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={50}
                        width={175}
                        className="h-[35px] w-auto"
                        priority
                    />
                </Link>
                <div>
                    <Label
                        htmlFor="image-input"
                        className={cn(buttonVariants({
                            variant: "ghost",
                            className: hasImage ? "opacity-50 pointer-events-none" : "cursor-pointer"
                        }))}
                    >
                        <ImagePlus className="size-4 mr-1" />
                        Add Image
                    </Label>
                    <Button
                        variant="ghost"
                        onClick={() => setHasPoll(true)}
                        disabled={hasPoll}
                    >
                        <Rows3 className="size-4 mr-1" />
                        Add Poll
                    </Button>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;

export const NavbarLoader = () => {
    return (
        <nav className="sticky top-0 h-[60px] bg-card px-4 py-2 shadow-lg z-10">
            <div className="max-w-[1400px] w-full h-full mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center justify-center"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={50}
                        width={175}
                        className="h-[35px] w-auto"
                        priority
                    />
                </Link>
                <div className="flex">
                    <Skeleton className="h-9 w-[120px]" />
                    <Skeleton className="h-9 w-[102px]" />
                </div>
            </div>
        </nav>
    )
};