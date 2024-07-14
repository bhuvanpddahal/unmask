import { create } from "zustand";

interface Reply {
    id: string;
    postId: string;
    replierUsername: string;
    reply: string;
    isEdited: boolean;
    repliedAt: Date;
}

interface UseDeleteReplyModalState {
    isOpen: boolean;
    reply: Reply;
    open: () => void;
    close: () => void;
    setReply: (reply: Reply) => void;
}

const defaultReply: Reply = {
    id: "",
    postId: "",
    replierUsername: "",
    reply: "",
    isEdited: false,
    repliedAt: new Date()
};

export const useDeleteReplyModal = create<UseDeleteReplyModalState>((set) => ({
    isOpen: false,
    reply: defaultReply,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, reply: defaultReply }),
    setReply: (reply) => set({ reply })
}));