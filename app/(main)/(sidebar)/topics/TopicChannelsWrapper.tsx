interface TopicChannelsWrapperProps {
    topic: string;
    children: React.ReactNode;
}

const TopicChannelsWrapper = ({
    topic,
    children
}: TopicChannelsWrapperProps) => {
    return (
        <div className="bg-white dark:bg-card p-5 pt-3 rounded-md">
            <div className="mb-2">
                <h3 className="text-[13px] text-zinc-500">
                    {topic}
                </h3>
            </div>
            {children}
        </div>
    )
};

export default TopicChannelsWrapper;