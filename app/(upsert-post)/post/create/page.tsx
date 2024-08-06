import { Metadata } from "next";

import PostCreationContent from "./Content";

export const metadata: Metadata = {
    title: "Create Post"
};

const PostCreationPage = () => {
    return (
        <div>
            <PostCreationContent />
        </div>
    );
};

export default PostCreationPage;