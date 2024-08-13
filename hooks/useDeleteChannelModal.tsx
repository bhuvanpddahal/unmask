import { create } from "zustand";

interface UseDeleteChannelModalState {
    isOpen: boolean;
    channelId?: string;
    open: () => void;
    close: () => void;
    setChannelId: (id: string) => void;
}

export const useDeleteChannelModal = create<UseDeleteChannelModalState>((set) => ({
    isOpen: false,
    channelId: undefined,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setChannelId: (id) => set({ channelId: id })
}));