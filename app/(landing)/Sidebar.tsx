import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AlignJustify } from "lucide-react";

import NavItems from "./NavItems";
import NavButtons from "./NavButtons";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/Sheet";
import { Separator } from "@/components/ui/Separator";

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="p-2.5 rounded-full transition-colors hover:bg-primary/10 lg:hidden">
                <AlignJustify className="text-zinc-900 h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-screen sm:max-w-sm">
                <div className="w-full">
                    <Link
                        href="/"
                        className="flex items-center [state=open]:"
                        onClick={() => setOpen(false)}
                    >
                        <Image
                            src="logo.svg"
                            alt="Logo"
                            height={48.88}
                            width={40}
                        />
                        <span className="font-extrabold text-zinc-800 text-lg">
                            QuickCodeKit
                        </span>
                    </Link>

                    <NavItems
                        className="mt-6 py-4 flex flex-col gap-y-4"
                        setOpen={setOpen}
                    />

                    <Separator className="my-4" />

                    <NavButtons
                        className="flex flex-col gap-y-4"
                        setOpen={setOpen}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
};

export default Sidebar;