import { create } from "zustand";

interface UseSigninModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useSigninModal = create<UseSigninModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));