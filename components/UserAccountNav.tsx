"use client";

import {
    LayoutGrid,
    LogOut,
    User
} from "lucide-react";
import Link from "next/link";
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

                <DropdownMenuItem asChild className="text-[13px] font-medium">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutGrid className="size-4 text-zinc-600" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-[13px] font-medium">
                    <Link href="/settings" className="flex items-center gap-2">
                        <User className="size-4 text-zinc-600" />
                        Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    signOut({
                        callbackUrl: `${window.location.origin}/signin`
                    });
                }} className="cursor-pointer flex items-center gap-2 text-[13px] font-medium">
                    <LogOut className="size-4 text-zinc-600" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserAccountNav;