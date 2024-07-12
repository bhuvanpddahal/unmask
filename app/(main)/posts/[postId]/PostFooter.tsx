import {
    Eye,
    Heart,
    MessageSquare,
    Share
} from "lucide-react";

import { CardFooter } from "@/components/ui/Card";

const PostFooter = () => {
    return (
        <CardFooter className="p-4 pt-6">
            <div className="w-full flex justify-between">
                <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <Heart className="size-3" />
                        13
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <MessageSquare className="size-3" />
                        39
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                        <Eye className="size-3" />
                        698
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 rounded-full hover:bg-accent">
                    <Share className="size-3" />
                    Share
                </div>
            </div>
        </CardFooter>
    )
};

export default PostFooter;

export const PostFooterLoader = () => (
    <CardFooter className="p-4 pt-6">
        <div className="w-full flex justify-between">
            <div className="flex gap-3 text-sm">
                <div className="flex items-center gap-1 pl-2 pr-7 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                    <Heart className="size-3" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-8 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                    <MessageSquare className="size-3" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-9 py-1 bg-zinc-100 rounded-full hover:bg-accent">
                    <Eye className="size-3" />
                </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 rounded-full hover:bg-accent">
                <Share className="size-3" />
                Share
            </div>
        </div>
    </CardFooter>
);