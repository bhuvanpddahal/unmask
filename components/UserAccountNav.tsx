"use client";

import Link from "next/link";
import {
    Bookmark,
    LogOut,
    User
} from "lucide-react";
import { signOut } from "next-auth/react";

import UserAvatar from "./UserAvatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UserAccountNav = () => {
    const currentUser = useCurrentUser();

    if (!currentUser) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    image={currentUser.image}
                    username={currentUser.username}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>
                    <p className="text-[13px]">{currentUser.username}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="text-sm font-medium">
                    <Link href="/user/profile" className="flex items-center gap-2">
                        <User className="size-4 text-zinc-600" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-sm font-medium">
                    <Link href="/user/bookmarks" className="flex items-center gap-2">
                        <Bookmark className="size-4 text-zinc-600" />
                        Bookmarks
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    signOut({
                        callbackUrl: `${window.location.origin}/signin`
                    });
                }} className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                    <LogOut className="size-4 text-zinc-600" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserAccountNav;