import Header from "../../Header";
import Bookmarks from "./Content";

export const metadata = {
    title: "Your Bookmarks"
};

const UserBookmarksPage = () => {
    return (
        <div>
            <Header
                title="Bookmarks"
                description="All of your bookmarks in one place."
            />
            <div className="bg-white dark:bg-card p-5 rounded-md">
                <Bookmarks />
            </div>
        </div>
    )
};

export default UserBookmarksPage;