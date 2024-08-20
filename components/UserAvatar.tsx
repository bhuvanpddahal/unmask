import { User } from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/Avatar";

interface UserAvatarProps {
    image: string | null;
    username: string;
    className?: string;
}

const UserAvatar = ({
    image,
    username,
    className = ""
}: UserAvatarProps) => {
    return (
        <Avatar
            className={className}
            title={username}
        >
            <AvatarImage src={image || ""} />
            <AvatarFallback className="font-medium uppercase">
                {username ? username[0] : (
                    <User className="size-4 text-zinc-700" />
                )}
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;