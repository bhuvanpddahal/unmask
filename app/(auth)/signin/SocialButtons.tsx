"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/Button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const SocialButtons = () => {
    const [disabled, setDisabled] = useState(false);

    const signinWithSocial = (provider: "google" | "github") => {
        setDisabled(true);

        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        });
    };

    return (
        <div className="space-y-3">
            <Button
                onClick={() => signinWithSocial("google")}
                className="w-full"
                variant="outline"
                disabled={disabled}
            >
                <FcGoogle className="h-4 w-4 mr-2" />
                Continue with Google
            </Button>
            <Button
                onClick={() => signinWithSocial("github")}
                className="w-full"
                disabled={disabled}
            >
                <FaGithub className="h-4 w-4 mr-2" />
                Continue with GitHub
            </Button>
        </div>
    )
};

export default SocialButtons;