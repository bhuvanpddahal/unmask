import Bookmarks from "./Content";

export const metadata = {
    title: "Your Bookmarks"
};

const UserBookmarksPage = () => {
    return (
        <div>
            <header className="mb-4">
                <h1 className="text-xl font-bold text-foreground">
                    Bookmarks
                </h1>
                <p className="text-sm text-slate-500">
                    All of your bookmarks in one place.
                </p>
            </header>
            <div className="bg-white p-5 rounded-md">
                <Bookmarks />
            </div>
        </div>
    )
};

export default UserBookmarksPage;