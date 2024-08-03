import Link from "next/link";
import Image from "next/image";
import {
    AlignRight,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import UserAvatar from "@/components/UserAvatar";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { mobileSidebarItems } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button, buttonVariants } from "@/components/ui/Button";

const MobileSidebar = () => {
    const user = useCurrentUser();
    const pathname = usePathname();
    const isSignedIn = !!(user && user.id);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden">
                <AlignRight />
            </SheetTrigger>
            <SheetContent className="bg-white dark:bg-background w-full sm:w-3/4 flex flex-col overflow-y-auto">
                <Image
                    src="/logo-icon.png"
                    alt="Logo"
                    height={50}
                    width={50}
                    className="h-[35px] w-fit"
                    priority
                />

                <ul className="flex-1 space-y-3">
                    {mobileSidebarItems.map((sidebarItem) => (
                        <li key={sidebarItem.header}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold">
                                    {sidebarItem.header}
                                </h2>
                                <ChevronDown className="size-5" />
                            </div>
                            {sidebarItem.items.length > 0 && (
                                <ul className="space-y-1 mt-3">
                                    {sidebarItem.items.map((item) => {
                                        const isActive = item.href === "/"
                                            ? pathname === "/"
                                            : pathname.includes(item.href);

                                        return (
                                            <li key={item.label}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                                        isActive ? "text-accent-foreground bg-accent" : "text-zinc-500"
                                                    )}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {isActive ? (
                                                        <item.icon.active className="size-[1.15rem]" />
                                                    ) : (
                                                        <item.icon.default className="size-[1.15rem]" />
                                                    )}
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="mt-4">
                    {isSignedIn ? (
                        <>
                            <Link
                                href="/user/profile"
                                className="flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="flex items-center gap-x-2">
                                    <UserAvatar
                                        username={user.name || ""}
                                        image={user.image}
                                    />
                                    <span className="text-sm font-medium">
                                        {user.username}
                                    </span>
                                </div>
                                <ChevronRight className="size-4" />
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setIsOpen(false);
                                    signOut({
                                        callbackUrl: `${window.location.origin}/signin`
                                    });
                                }}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/signup" className={cn(buttonVariants({
                                className: "w-full"
                            }))}>
                                Sign up
                            </Link>
                            <Link href="/signin" className={cn(buttonVariants({
                                variant: "ghost",
                                className: "w-full"
                            }))}>
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;