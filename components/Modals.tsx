import SigninModal from "./SigninModal";
import DeletePostModal from "./DeletePostModal";
import DeleteReplyModal from "./DeleteReplyModal";
import InviteMemberModal from "./InviteMemberModal";
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
            <InviteMemberModal />
        </>
    );
};

export default Modals;