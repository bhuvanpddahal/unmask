import { Metadata } from "next";
import { ChannelType } from "@prisma/client";

import TopicChannels from "./TopicChannels";
import NewChannelButton from "./NewChannelButton";
import TopicChannelsWrapper from "./TopicChannelsWrapper";
import { channelTypes } from "@/constants";
import { Separator } from "@/components/ui/Separator";

export const metadata: Metadata = {
    title: "All Channels"
};

const TopicsPage = () => {
    return (
        <div className="flex-1 p-4 sm:p-6 pt-10">
            <header className="flex flex-col lg:flex-row items-start lg:items-end lg:justify-between gap-y-5">
                <div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                        Discover and Follow Topic Channels
                    </h1>
                    <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 mt-2">
                        You can tailor your home feed to align with interests.
                    </p>
                </div>
                <NewChannelButton />
            </header>
            <Separator className="my-7" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
                Topic Channels
            </h2>
            <div className="space-y-8 mt-3">
                {Object.entries(channelTypes).map(([key, value]) => (
                    <TopicChannelsWrapper key={key} topic={value}>
                        <TopicChannels type={key as ChannelType} />
                    </TopicChannelsWrapper>
                ))}
            </div>
        </div>
    );
};

export default TopicsPage;