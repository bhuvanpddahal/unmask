import Header from "../Header";
import UserForm from "./UserForm";

export const metadata = {
    title: "Your Profile"
};

const UserProfilePage = () => {
    return (
        <div>
            <Header
                title="Profile"
                description="View and update your personal information."
            />
            <div className="bg-white p-5 rounded-md">
                <div>
                    <div className="text-sm font-semibold mb-2">
                        General
                    </div>
                    <UserForm />
                </div>
            </div>
        </div>
    )
};

export default UserProfilePage;