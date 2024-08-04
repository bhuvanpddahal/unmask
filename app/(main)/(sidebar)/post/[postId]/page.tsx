import { Metadata } from "next";

import PostDetailsContent from "./Content";
import { getPostTitle } from "@/actions/post";

interface PostDetailsPageProps {
    params: {
        postId: string;
    };
}

export const generateMetadata = async (
    { params: { postId } }: PostDetailsPageProps
): Promise<Metadata> => {
    const payload = { postId };
    const post = await getPostTitle(payload);
    return {
        title: post.title
    };
};

const PostDetailsPage = ({
    params: { postId }
}: PostDetailsPageProps) => {
    return (
        <div className="flex-1 p-4 sm:p-6 pt-4">
            <PostDetailsContent postId={postId} />
        </div>
    );
};

export default PostDetailsPage;