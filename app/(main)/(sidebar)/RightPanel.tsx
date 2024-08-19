"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const RightPanel = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const pathname = usePathname();
    const isSignedIn = !!(user && user.id);
    const githubUrl = "https://github.com/BhuvanPdDahal/unmask";

    if (pathname === "/topics") return null;

    return (
        <div className="hidden xl:block shrink-0 sticky top-[60px] h-fit w-[346px] p-4 pl-0">
            <Card className="p-4">
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
                        className="w-full bg-card text-primary dark:opacity-90 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => router.push(isSignedIn ? "/post/create" : "/signin")}
                    >
                        {isSignedIn ? "Create post" : "Sign up"}
                    </Button>
                </div>
            </Card>
            <div className="mt-5 px-4 space-y-3">
                <p className="text-xs leading-[18px] text-muted-foreground font-medium">
                    Curious about the implementation or have a suggestion? Find us on {" "}
                    <Link href={githubUrl} target="_blank">
                        GitHub
                    </Link>
                </p>
                <div className="text-xs text-muted-foreground font-semibold mt-2">
                    {(new Date()).getFullYear()} <span className="text-primary">Unmask</span> Inc.
                </div>
            </div>
        </div>
    );
};

export default RightPanel;