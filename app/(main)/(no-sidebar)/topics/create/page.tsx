import { Metadata } from "next";

import Header from "../../Header";
import ChannelCreationContent from "./Content";

export const metadata: Metadata = {
    title: "Create Channel"
};

const ChannelCreationPage = () => {
    return (
        <div>
            <Header
                title="Create Your Community"
                description="Build connections, share knowledge, and find your people. Create a channel to discuss topics that matter to you. Whether it's academics, career goals, or just hanging out, start your own community today."
            />
            <div className="bg-white dark:bg-card p-5 rounded-md">
                <ChannelCreationContent />
            </div>
        </div>
    );
};

export default ChannelCreationPage;