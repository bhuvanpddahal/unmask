import { Metadata } from "next";

import Header from "../../Header";
import UserForm from "./UserForm";
import ThemePreference from "./ThemePreference";

export const metadata: Metadata = {
    title: "Your Profile"
};

const UserProfilePage = () => {
    return (
        <div>
            <Header
                title="Profile"
                description="View and update your personal information."
            />
            <div className="bg-white dark:bg-card p-5 rounded-md">
                <div className="text-sm font-semibold mb-2">
                    General
                </div>
                <UserForm />
            </div>
            <div className="bg-white dark:bg-card p-5 rounded-md mt-8">
                <div className="text-sm font-semibold mb-2">
                    Preference
                </div>
                <ThemePreference />
            </div>
        </div>
    )
};

export default UserProfilePage;