import { Metadata } from "next";

import ChannelInvitationContent from "./Content";

interface ChannelInvitationPageProps {
    params: {
        inviteCode: string;
    };
}

export const metadata: Metadata = {
    title: "Channel Invitation"
};

const ChannelInvitationPage = ({
    params: { inviteCode }
}: ChannelInvitationPageProps) => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-96 w-full bg-card p-5 rounded-md shadow dark:shadow-zinc-700">
                <h1 className="font-semibold text-lg text-zinc-800 dark:text-zinc-200">
                    Invitation
                </h1>
                <ChannelInvitationContent inviteCode={inviteCode} />
                <footer className="text-xs text-zinc-500 text-center dark:text-zinc-400">
                    © {(new Date()).getFullYear()} Unmask, Inc. Privacy and Terms
                </footer>
            </div>
        </div>
    );
};

export default ChannelInvitationPage;