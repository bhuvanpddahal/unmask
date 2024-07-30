import Posts from "./Posts";
import AdBanner from "./AdBanner";
import CreatePost from "./CreatePost";

const MainPage = () => {
    return (
        <div className="flex-1 p-6 pt-4 space-y-4">
            <h1 className="text-lg font-extrabold text-slate-700 dark:text-slate-300">
                Unmask - Anonymous and Professional Community
            </h1>
            <CreatePost />
            <AdBanner />
            <Posts />
        </div>
    )
};

export default MainPage;