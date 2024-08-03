"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import MobileSidebar from "./(sidebar)/MobileSidebar";
import UserAccountNav from "@/components/UserAccountNav";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants";
import { buttonVariants } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Navbar = () => {
    const user = useCurrentUser();
    const pathname = usePathname();
    const isSignedIn = !!(user && user.id);

    return (
        <nav className="sticky top-0 h-[60px] bg-card px-4 py-2 shadow-lg z-10">
            <div className="relative max-w-[1400px] w-full h-full mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center justify-center"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        height={50}
                        width={175}
                        className="h-[35px] w-auto hidden lg:inline-block"
                        priority
                    />
                    <Image
                        src="/logo-icon.png"
                        alt="Logo"
                        height={50}
                        width={50}
                        className="h-[35px] w-auto lg:hidden"
                        priority
                    />
                </Link>

                <ul className="hidden lg:flex gap-x-2 absolute left-1/2 top-0 h-full -translate-x-1/2">
                    {navItems.map((item) => {
                        const isActive = item.href === "/"
                            ? pathname === "/" || pathname === "/polls" || pathname.includes("/topics") || pathname.includes("/post")
                            : pathname.includes(item.href);

                        return (
                            <li
                                key={item.label}
                                className="relative"
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "w-[100px] flex flex-col items-center gap-y-1 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "text-accent-foreground" : "text-zinc-500"
                                    )}
                                >
                                    {isActive ? (
                                        <item.icon.active className="size-4" />
                                    ) : (
                                        <item.icon.default className="size-4" />
                                    )}
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                                {isActive && <div className="absolute top-[calc(100%+6px)] left-0 w-full h-[2px] bg-accent-foreground" />}
                            </li>
                        )
                    })}
                </ul>

                <div className="flex gap-x-2">
                    {isSignedIn ? (
                        <UserAccountNav />
                    ) : (
                        <>
                            <Link href="/signin" className={cn(buttonVariants({
                                variant: "ghost"
                            }))}>
                                Sign in
                            </Link>
                            <Link href="/signup" className={cn(buttonVariants())}>
                                Sign up
                            </Link>
                        </>
                    )}
                    <MobileSidebar />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;