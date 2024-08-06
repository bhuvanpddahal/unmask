import { Metadata } from "next";

import ChannelDetailsContent from "./Content";
import { getChannelMetadata } from "@/actions/channel";

interface ChannelDetailsPageProps {
    params: {
        channelId: string;
    };
}

export const generateMetadata = async (
    { params: { channelId } }: ChannelDetailsPageProps
): Promise<Metadata> => {
    const payload = { channelId };
    const channel = await getChannelMetadata(payload);
    return {
        title: channel.name,
        openGraph: {
            title: channel.name,
            description: channel.description || undefined,
            siteName: "Unmask"
        }
    };
};

const ChannelDetailsPage = ({
    params: { channelId }
}: ChannelDetailsPageProps) => {
    return (
        <div className="flex-1 p-4 sm:p-6 pt-4">
            <ChannelDetailsContent channelId={channelId} />
        </div>
    );
};

export default ChannelDetailsPage;