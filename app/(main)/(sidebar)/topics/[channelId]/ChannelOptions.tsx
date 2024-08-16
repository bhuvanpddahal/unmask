import {
    Ellipsis,
    LinkIcon,
    Pencil,
    Trash2,
    UserPlus
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { useInviteMemberModal } from "@/hooks/useInviteMemberModal";
import { useDeleteChannelModal } from "@/hooks/useDeleteChannelModal";

interface ChannelOptionsProps {
    channelId: string;
    inviteCode: string;
    isCreator: boolean;
}

const ChannelOptions = ({
    channelId,
    inviteCode,
    isCreator
}: ChannelOptionsProps) => {
    const router = useRouter();
    const { open: openInviteMemberModal } = useInviteMemberModal();
    const { open: openDeleteChannelModal, setChannelId } = useDeleteChannelModal();

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
                {isCreator && (
                    <>
                        <DropdownMenuItem onClick={() => openInviteMemberModal(channelId, inviteCode)}>
                            <UserPlus className="size-4 mr-2" />
                            Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/topics/${channelId}/edit`)}>
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setChannelId(channelId);
                            openDeleteChannelModal();
                        }}>
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