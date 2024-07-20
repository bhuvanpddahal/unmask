import { create } from "zustand";

interface Post {
    id: string;
    creatorUsername: string;
    creatorImage: string | null;
    title: string;
    description: string;
    isEdited: boolean;
    createdAt: Date;
}

interface UseDeletePostModalState {
    isOpen: boolean;
    post: Post;
    open: () => void;
    close: () => void;
    setPost: (post: Post) => void;
}

const defaultPost: Post = {
    id: "",
    creatorUsername: "",
    creatorImage: null,
    title: "",
    description: "",
    isEdited: false,
    createdAt: new Date()
};

export const useDeletePostModal = create<UseDeletePostModalState>((set) => ({
    isOpen: false,
    post: defaultPost,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, post: defaultPost }),
    setPost: (post) => set({ post })
}));