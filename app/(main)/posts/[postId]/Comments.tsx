import Reply from "./Reply";
import SortBy, { SortByLoader } from "./SortBy";
import Comment, { CommentLoader } from "./Comment";

const Comments = () => {
    return (
        <div className="p-4">
            <SortBy />
            <ul className="space-y-4">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index}>
                        <Comment />
                        <ul className="pl-12 space-y-3 mt-4">
                            <Reply />
                            <Reply />
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    )
};

export default Comments;

export const CommentsLoader = () => (
    <div className="p-4">
        <SortByLoader />
        <ul className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
                <CommentLoader key={index} />
            ))}
        </ul>
    </div>
);