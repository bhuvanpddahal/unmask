import { Metadata } from "next";

import ChannelDetailsContent from "./Content";
import { getChannelTitle } from "@/actions/channel";

interface ChannelDetailsPageProps {
    params: {
        channelId: string;
    };
}

export const generateMetadata = async (
    { params: { channelId } }: ChannelDetailsPageProps
): Promise<Metadata> => {
    const payload = { channelId };
    const channel = await getChannelTitle(payload);
    return {
        title: channel.title
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