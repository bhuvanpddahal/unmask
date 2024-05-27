"use client";

import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import VerificationForm from "./VerificationForm";
import { getUserEmail } from "@/actions/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const VerifyEmailContent = () => {
    const router = useRouter();
    const user = useCurrentUser();
    const isSignedIn = user?.id && user.email;
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const {
        data,
        status
    } = useQuery({
        enabled: !!userId && !isSignedIn,
        queryKey: ["verify-email", { userId }],
        queryFn: async () => {
            const payload = { userId: userId || "" };
            const data = await getUserEmail(payload);
            return data;
        }
    });

    if (isSignedIn) {
        router.push("/dashboard");
    }
    if (!userId) return (
        <div className="flex flex-col items-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
            />
            <h2 className="text-lg font-bold text-zinc-800 text-center">
                Missing User Id!
            </h2>
        </div>
    )
    if (status === "pending") return (
        <ClipLoader
            cssOverride={{
                display: "block",
                margin: "20px auto 5px"
            }}
        />
    )
    if (!data || data.error) return (
        <div className="flex flex-col items-center gap-y-2">
            <Image
                src="/error.png"
                alt="Error"
                height={100}
                width={100}
                className="mx-auto"
            />
            <div>
                <h2 className="text-lg font-bold text-zinc-800 text-center">
                    Something went wrong!
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg text-center">
                    Try refreshing the page. If the error still persists, try signing in.
                </p>
            </div>
        </div>
    )
    if (data.emailVerified) {
        router.push("/signin");
    }

    return (
        <>
            <p className="text-zinc-500 text-center text-[13px] mb-4">
                We have sent a code to
                <span className="font-medium"> {data.email}</span>,
                please check your inbox and insert the code in form below to verify your email.
            </p>

            <VerificationForm
                userId={userId}
            />

            <p className="text-zinc-500 text-center text-[13px] mb-3">
                Don&apos;t worry, it&apos;s only one time. Once your email is verified, you don&apos;t need to do this anymore :)
            </p>
        </>
    )
};

export default VerifyEmailContent;