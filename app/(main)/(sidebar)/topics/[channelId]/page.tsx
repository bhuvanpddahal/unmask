import ChannelDetailsContent from "./Content";

interface ChannelDetailsPageProps {
    params: {
        channelId: string;
    };
}

export const metadata = {
    title: "Channel Details"
};

const ChannelDetailsPage = ({
    params: { channelId }
}: ChannelDetailsPageProps) => {
    return (
        <div className="flex-1 p-6 pt-4">
            <ChannelDetailsContent channelId={channelId} />
        </div>
    )
};

export default ChannelDetailsPage;