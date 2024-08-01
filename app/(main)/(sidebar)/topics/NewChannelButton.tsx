"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

const NewChannelButton = () => {
    const router = useRouter();

    return (
        <Button
            size="lg"
            onClick={() => router.push("/topics/create")}
        >
            New Channel
        </Button>
    );
};

export default NewChannelButton;