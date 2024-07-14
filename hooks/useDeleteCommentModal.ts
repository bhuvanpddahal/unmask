import { create } from "zustand";

interface Comment {
    id: string;
    postId: string;
    commenterUsername: string;
    comment: string;
    isEdited: boolean;
    commentedAt: Date;
}

interface UseDeleteCommentModalState {
    isOpen: boolean;
    comment: Comment;
    open: () => void;
    close: () => void;
    setComment: (comment: Comment) => void;
}

const defaultComment = {
    id: "",
    postId: "",
    commenterUsername: "",
    comment: "",
    isEdited: false,
    commentedAt: new Date()
};

export const useDeleteCommentModal = create<UseDeleteCommentModalState>((set) => ({
    isOpen: false,
    comment: defaultComment,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, comment: defaultComment }),
    setComment: (comment) => set({ comment })
}));