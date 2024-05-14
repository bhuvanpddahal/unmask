"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Navbar = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const navRef = useRef<HTMLElement>(null);

    const adjustNavbar = () => {
        if (
            document.body.scrollTop > 100 ||
            document.documentElement.scrollTop > 100
        ) {
            navRef.current?.classList.add("sticky-nav");
        } else {
            navRef.current?.classList.remove("sticky-nav");
        }
    };

    useEffect(() => {
        adjustNavbar();
        window.addEventListener("scroll", adjustNavbar);
        return () => window.removeEventListener("scroll", adjustNavbar);
    }, []);

    return (
        <nav ref={navRef} className="pl-2 pr-4 py-3">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center justify-center"
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
                <div className="space-x-2">
                    {user && user.id ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>
                            <Button onClick={() => router.push("/dashboard")}>
                                Dashboard
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => router.push("/signin")}>
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;