"use client";

import { usePathname, useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const RightPanel = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const pathname = usePathname();
    const isSignedIn = !!(user && user.id);

    if (pathname === "/topics") return null;

    return (
        <div className="hidden xl:block sticky top-[60px] h-fit p-4 pl-0">
            <Card className="w-[330px] p-4">
                <div className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-tight mb-2">
                    For You
                </div>
                <div className="bg-primary rounded-sm p-4 space-y-4">
                    <p className="text-primary-foreground text-xl font-semibold">
                        {isSignedIn
                            ? "Ready to share your experiences? Start a conversation on Unmask"
                            : "Join the Unmask community, and share your experiences anonymously"
                        }
                    </p>
                    <Button
                        className="w-full bg-card text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => router.push(isSignedIn ? "/post/create" : "/signin")}
                    >
                        {isSignedIn ? "Create post" : "Sign up"}
                    </Button>
                </div>
            </Card>
        </div>
    )
};

export default RightPanel;