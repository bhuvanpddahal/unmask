import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { LuMessageSquare, LuShare } from "react-icons/lu";

import { CardFooter } from "@/components/ui/Card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSigninModal } from "@/hooks/useSigninModal";
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
    const user = useCurrentUser();
    const isSignedIn = !!(user && user.id);
    const { open } = useSigninModal();

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
                        className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isSignedIn) likeOrUnlikePost();
                            else open();
                        }}
                    >
                        {isLiked ? (
                            <HiHeart className="size-4" />
                        ) : (
                            <HiOutlineHeart className="size-4" />
                        )}
                        {likesCount}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                        <LuMessageSquare className="size-3.5" />
                        {commentsCount}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                        <MdOutlineRemoveRedEye className="size-4" />
                        {viewsCount}
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
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
                <div className="flex items-center gap-1 pl-2 pr-5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                    <HiOutlineHeart className="size-4" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-6 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                    <LuMessageSquare className="size-3.5" />
                </div>
                <div className="flex items-center gap-1 pl-2 pr-7 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                    <MdOutlineRemoveRedEye className="size-4" />
                </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                <LuShare className="size-4" />
                Share
            </div>
        </div>
    </CardFooter>
);