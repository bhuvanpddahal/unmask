import UserAvatar from "@/components/UserAvatar";
import { Heart } from "lucide-react";

const Reply = () => {
    return (
        <li className="flex gap-2">
            <UserAvatar
                image=""
                username="Username"
                className="size-8"
            />
            <div className="w-full">
                <div className="bg-zinc-100 p-4 rounded-md rounded-ss-none">
                    <p className="text-sm text-zinc-800 font-medium">
                        This is my reply
                    </p>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-sm mt-2 rounded-full hover:bg-accent">
                    <Heart className="size-3" />
                    13
                </div>
            </div>
        </li>
    )
};

export default Reply;