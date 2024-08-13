import SigninModal from "./SigninModal";
import DeletePostModal from "./DeletePostModal";
import DeleteReplyModal from "./DeleteReplyModal";
import DeleteChannelModal from "./DeleteChannelModal";
import DeleteCommentModal from "./DeleteCommentModal";

const Modals = () => {
    return (
        <>
            <SigninModal />
            <DeleteCommentModal />
            <DeleteReplyModal />
            <DeletePostModal />
            <DeleteChannelModal />
        </>
    );
};

export default Modals;