import Posts from "./Posts";
import CreatePost from "./CreatePost";

const MainPage = () => {
    return (
        <div className="flex-1 p-6 pt-4 space-y-4">
            <h1 className="text-lg font-extrabold text-slate-700">
                Unmask - Anonymous and Professional Community
            </h1>
            <CreatePost />
            <Posts />
        </div>
    )
};

export default MainPage;