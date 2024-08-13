import {
    Ellipsis,
    LinkIcon,
    Pencil,
    Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ChannelOptionsProps {
    channelId: string;
    creatorId: string;
}

const ChannelOptions = ({
    channelId,
    creatorId
}: ChannelOptionsProps) => {
    const router = useRouter();
    const currentUser = useCurrentUser();
    const isSameUser = currentUser?.id === creatorId;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-0">
                <Button
                    variant="outline"
                    className="size-9 px-0 rounded-full"
                >
                    <Ellipsis className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-[13px] font-medium">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/topics/${channelId}`)}>
                    <LinkIcon className="size-4 mr-2" />
                    Copy link
                </DropdownMenuItem>
                {isSameUser && (
                    <>
                        <DropdownMenuItem onClick={() => router.push(`/topics/${channelId}/edit`)}>
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                            <Trash2 className="size-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ChannelOptions;