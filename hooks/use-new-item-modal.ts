import { create } from "zustand";

interface useNewItemState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useNewItem = create<useNewItemState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));