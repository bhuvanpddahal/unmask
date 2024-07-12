import PostDetailsContent from "./Content";

interface PostDetailsPageProps {
    params: {
        postId: string;
    };
}

export const metadata = {
    title: "Post Details"
};

const PostDetailsPage = ({
    params: { postId }
}: PostDetailsPageProps) => {
    return (
        <div className="flex-1 p-6 pt-4">
            <PostDetailsContent postId={postId} />
        </div>
    ) 
};

export default PostDetailsPage;