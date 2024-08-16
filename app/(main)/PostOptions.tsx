import {
    Ellipsis,
    LinkIcon,
    Pencil,
    Trash2
} from "lucide-react";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { useDeletePostModal } from "@/hooks/useDeletePostModal";

interface PostOptionsProps {
    postId: string;
    isCreator: boolean;
    creatorUsername: string;
    creatorImage: string | null;
    title: string;
    description: string;
    isEdited: boolean;
    createdAt: Date;
}

const PostOptions = ({
    postId,
    isCreator,
    creatorUsername,
    creatorImage,
    title,
    description,
    isEdited,
    createdAt
}: PostOptionsProps) => {
    const router = useRouter();
    const { open, setPost } = useDeletePostModal();

    const handleDelete = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
        const postValue = {
            id: postId,
            creatorUsername,
            creatorImage,
            title,
            description,
            isEdited,
            createdAt
        };
        setPost(postValue);
        open();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent">
                <Ellipsis className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-[13px] font-medium">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/post/${postId}`)
                    }}
                >
                    <LinkIcon className="size-4 mr-2" />
                    Copy link
                </DropdownMenuItem>
                {isCreator && (
                    <>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/post/${postId}/edit`)
                            }}
                        >
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PostOptions;