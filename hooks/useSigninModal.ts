import { create } from "zustand";

interface UseSigninModalState {
    isOpen: boolean;
    pathToRedirect: string;
    open: () => void;
    close: () => void;
    setPathToRedirect: (path: string) => void;
}

export const useSigninModal = create<UseSigninModalState>((set) => ({
    isOpen: false,
    pathToRedirect: "/",
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false, pathToRedirect: "/" }),
    setPathToRedirect: (path) => set({ pathToRedirect: path })
}));