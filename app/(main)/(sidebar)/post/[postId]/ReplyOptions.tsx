import {
    EllipsisVertical,
    Pencil,
    Trash2,
    X
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { useDeleteReplyModal } from "@/hooks/useDeleteReplyModal";

interface ReplyOptionsProps {
    postId: string;
    replyId: string;
    replierUsername: string;
    reply: string;
    repliedAt: Date;
    isEdited: boolean;
    isEditOpen: boolean;
    setIsEditOpen: Dispatch<SetStateAction<boolean>>;
}

const ReplyOptions = ({
    postId,
    replyId,
    replierUsername,
    reply,
    repliedAt,
    isEdited,
    isEditOpen,
    setIsEditOpen
}: ReplyOptionsProps) => {
    const { open, setReply } = useDeleteReplyModal();

    const handleDelete = () => {
        const replyValue = {
            id: replyId,
            postId,
            replierUsername,
            reply,
            isEdited,
            repliedAt
        };
        setReply(replyValue);
        open();
    };

    if (isEditOpen) return (
        <div
            className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-600"
            onClick={() => setIsEditOpen(false)}
        >
            <X className="size-4" />
        </div>
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-600">
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-[13px] font-medium">
                <DropdownMenuItem
                    onSelect={() => setIsEditOpen(true)}
                >
                    <Pencil className="size-4 mr-2" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={handleDelete}
                >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default ReplyOptions;