"use client";

import Image from "next/image";
import PulseLoader from "react-spinners/PulseLoader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { acceptInvitation } from "@/actions/channel";

interface ChannelInvitationContentProps {
    inviteCode: string;
}

const ChannelInvitationContent = ({
    inviteCode
}: ChannelInvitationContentProps) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const acceptChannelInvitation = async () => {
            const data = await acceptInvitation({ inviteCode });
            if (data.channelId) router.push(`/topics/${data.channelId}`);
            if (data.error) setError(data.error);
        };

        acceptChannelInvitation();
    }, [inviteCode, router]);

    if (error) return (
        <div className="py-6 flex flex-col items-center justify-center gap-y-1">
            <Image
                src="/error.svg"
                alt="Error"
                height={50}
                width={50}
            />
            <p className="text-[13px] font-medium text-zinc-400">
                {error}
            </p>
        </div>
    );

    return (
        <div className="py-8 text-center">
            <PulseLoader
                color="#ef6e4e"
                cssOverride={{
                    display: "inline-block"
                }}
                size={10}
            />
        </div>
    );
};

export default ChannelInvitationContent;