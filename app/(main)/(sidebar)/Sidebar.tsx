"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="shrink-0 w-[260px] h-[calc(100vh-60px)] sticky top-[60px] p-4 pr-0 hidden lg:block">
            <ul className="space-y-1.5">
                {sidebarItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.includes(item.href);

                    return (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "text-accent-foreground bg-accent" : "text-zinc-500"
                                )}
                            >
                                {isActive ? (
                                    <item.icon.active className="size-5" />
                                ) : (
                                    <item.icon.default className="size-5" />
                                )}
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;