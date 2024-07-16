import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { LuMessageSquare, LuShare } from "react-icons/lu";

import { CardFooter } from "@/components/ui/Card";
import { useLikeOrUnlikePost } from "@/hooks/useLikeOrUnlikePost";

interface PostFooterProps {
    postId: string;
    initialLikesCount: number;
    initialIsLiked: boolean;
    commentsCount: number;
    viewsCount: number;
}

const PostFooter = ({
    postId,
    initialLikesCount,
    initialIsLiked,
    commentsCount,
    viewsCount
}: PostFooterProps) => {
    const {
        likeOrUnlikePost,
        likesCount,
        isLiked
    } = useLikeOrUnlikePost(
        postId,
        initialLikesCount,
        initialIsLiked
    );

    return (
        <CardFooter className="p-4 pt-6">
            <div className="w-full flex justify-between">
                <div className="flex gap-3 text-sm">
                    <div
                        className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full cursor-pointer hover:bg-slate-200"
                        onClick={() => likeOrUnlikePost()}
                    >
                        {isLiked ? (
                            <HiHeart className="size-4 stroke-" />
                        ) : (
                            <HiOutlineHeart className="size-4" />
                        )}
                        {likesCount}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full cursor-pointer hover:bg-slate-200">
                        <LuMessageSquare className="size-3.5" />
                        {commentsCount}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full cursor-pointer hover:bg-slate-200">
                        <MdOutlineRemoveRedEye className="size-4" />
                        {viewsCount}
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 text-zinc-600 rounded-full cursor-pointer hover:bg-slate-200">
                    <LuShare className="size-4" />
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
                <div className="flex items-center gap-1 pl-2 pr-7 py-1 bg-zinc-100 text-zinc-500 rounded-full">
                    <HiOutlineHeart className="size-4" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-8 py-1 bg-zinc-100 text-zinc-500 rounded-full">
                    <LuMessageSquare className="size-3.5" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-9 py-1 bg-zinc-100 text-zinc-500 rounded-full">
                    <MdOutlineRemoveRedEye className="size-4" />
                </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 text-zinc-500 rounded-full">
                <LuShare className="size-4" />
                Share
            </div>
        </div>
    </CardFooter>
);