import Header from "../../Header";
import ChannelForm from "./ChannelForm";

const TopicCreationPage = () => {
    return (
        <div>
            <Header
                title="Create Your Community"
                description="Build connections, share knowledge, and find your people. Create a channel to discuss topics that matter to you. Whether it's academics, career goals, or just hanging out, start your own community today."
            />
            <div className="bg-white dark:bg-card p-5 rounded-md">
                <ChannelForm />
            </div>
        </div>
    )
};

export default TopicCreationPage;