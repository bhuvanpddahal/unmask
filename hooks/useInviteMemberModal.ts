import { create } from "zustand";

interface UseInviteMemberModalState {
    isOpen: boolean;
    channelId: string;
    inviteCode: string;
    open: (id: string, code: string) => void;
    close: () => void;
}

export const useInviteMemberModal = create<UseInviteMemberModalState>((set) => ({
    isOpen: false,
    channelId: "",
    inviteCode: "",
    open: (id, code) => set({ isOpen: true, channelId: id, inviteCode: code }),
    close: () => set({ isOpen: false, channelId: "", inviteCode: "" })
}));