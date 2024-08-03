import {
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import { LuShare } from "react-icons/lu";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

interface ShareButtonProps {
    postId: string;
}

const ShareButton = ({
    postId
}: ShareButtonProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const url = `${baseUrl}/post/${postId}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                    <LuShare className="size-4" />
                    Share
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="flex flex-col">
                <FacebookShareButton
                    url={url}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem className="gap-x-2">
                        <FacebookIcon size={16} round />
                        Facebook
                    </DropdownMenuItem>
                </FacebookShareButton>
                <TwitterShareButton
                    url={url}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem className="gap-x-2">
                        <TwitterIcon size={16} round />
                        Twitter
                    </DropdownMenuItem>
                </TwitterShareButton>
                <WhatsappShareButton
                    url={url}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem className="gap-x-2">
                        <WhatsappIcon size={16} round />
                        Whatsapp
                    </DropdownMenuItem>
                </WhatsappShareButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ShareButton;

export const ShareButtonLoader = () => (
    <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
        <LuShare className="size-4" />
        Share
    </div>
);