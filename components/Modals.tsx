import SigninModal from "./SigninModal";
import DeletePostModal from "./DeletePostModal";
import DeleteReplyModal from "./DeleteReplyModal";
import DeleteCommentModal from "./DeleteCommentModal";

const Modals = () => {
    return (
        <>
            <SigninModal />
            <DeleteCommentModal />
            <DeleteReplyModal />
            <DeletePostModal />
        </>
    );
};

export default Modals;