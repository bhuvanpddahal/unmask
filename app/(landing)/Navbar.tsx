"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

import Sidebar from "./Sidebar";
import NavItems from "./NavItems";
import NavButtons from "./NavButtons";

const Navbar = () => {
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
        <nav ref={navRef} className="pl-2 pr-4 py-3 bg-primary-foreground">
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

                <NavItems className="hidden lg:flex gap-x-16" />

                <NavButtons className="space-x-2 hidden lg:block" />

                <Sidebar />
            </div>
        </nav>
    )
};

export default Navbar;