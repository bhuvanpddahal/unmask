import { Metadata } from "next";

import PostEditContent from "./Content";

interface PostEditPageProps {
    params: {
        postId: string;
    };
}

export const metadata: Metadata = {
    title: "Edit Post"
};

const PostEditPage = ({
    params: { postId }
}: PostEditPageProps) => {
    return (
        <div>
            <PostEditContent postId={postId} />
        </div>
    );
};

export default PostEditPage;