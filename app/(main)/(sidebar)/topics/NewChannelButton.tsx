"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";

const NewChannelButton = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const isSignedIn = !!(user && user.id);
    const { open, setPathToRedirect } = useSigninModal();

    return (
        <Button
            size="lg"
            onClick={() => {
                if (isSignedIn) router.push("/topics/create");
                else {
                    setPathToRedirect("/topics/create");
                    open();
                }
            }}
        >
            New Channel
        </Button>
    );
};

export default NewChannelButton;