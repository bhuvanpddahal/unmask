"use client";

import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const CreatePost = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const isSignedIn = user && user.id;

    const handleClick = () => {
        if (isSignedIn) {
            router.push("/posts/create");
        } else {
            router.push("/signin");
        }
    };

    return (
        <Card
            className="flex items-center gap-x-2 px-4 py-5 cursor-pointer"
            onClick={handleClick}
        >
            <CirclePlus className="size-6 text-primary" />
            <span className="text-zinc-400 text-sm font-semibold">
                Start a post...
            </span>
        </Card>
    )
};

export default CreatePost;