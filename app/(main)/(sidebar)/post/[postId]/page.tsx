import { Metadata } from "next";

import PostDetailsContent from "./Content";
import { getPostMetadata } from "@/actions/post";

interface PostDetailsPageProps {
    params: {
        postId: string;
    };
}

export const generateMetadata = async (
    { params: { postId } }: PostDetailsPageProps
): Promise<Metadata> => {
    const payload = { postId };
    const post = await getPostMetadata(payload);
    return {
        title: post.title,
        openGraph: {
            title: post.title,
            description: post.description,
            siteName: "Unmask"
        }
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