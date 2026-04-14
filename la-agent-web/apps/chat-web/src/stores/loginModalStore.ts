import { create } from 'zustand';

interface LoginModalState {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  visible: false,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
}));
