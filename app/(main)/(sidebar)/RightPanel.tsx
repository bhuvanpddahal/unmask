"use client";

import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const RightPanel = () => {
    const router = useRouter();

    return (
        <div className="hidden lg:block sticky top-[60px] h-fit p-4 pl-0">
            <Card className="w-[330px] p-4">
                <div className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-tight mb-2">
                    For You
                </div>
                <div className="bg-primary rounded-sm p-4 space-y-4">
                    <p className="text-primary-foreground text-xl font-semibold">
                        Join the Unmask community, and share your experiences anonymously
                    </p>
                    <Button
                        className="w-full bg-white dark:bg-zinc-700 text-primary dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => router.push("/signup")}
                    >
                        Sign up
                    </Button>
                </div>
            </Card>
        </div>
    )
};

export default RightPanel;