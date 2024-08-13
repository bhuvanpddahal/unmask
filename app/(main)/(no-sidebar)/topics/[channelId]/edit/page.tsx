import { Metadata } from "next";

import Header from "../../../Header";
import EditChannelContent from "./Content";

interface EditChannelPageProps {
    params: {
        channelId: string;
    };
}

export const metadata: Metadata = {
    title: "Edit Channel"
};

const EditChannelPage = ({
    params: { channelId }
}: EditChannelPageProps) => {
    return (
        <div>
            <Header
                title="Update Your Channel"
                description="Make changes to your channel. Customize how it looks."
            />
            <div className="bg-white dark:bg-card p-5 rounded-md">
                <EditChannelContent channelId={channelId} />
            </div>
        </div>
    );
};

export default EditChannelPage;