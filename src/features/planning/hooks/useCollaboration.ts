
import { create } from 'zustand';

interface CollaborationState {
  open: boolean;
  toggleOpen: () => void;
  generateInvite: () => Promise<string>;
  lastInvite: string | null;
}

export const useCollaboration = create<CollaborationState>((set, get) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
  generateInvite: async () => {
    const inviteUrl = `${window.location.origin}/planning/invite/${Date.now()}`;
    set({ lastInvite: inviteUrl });
    return inviteUrl;
  },
  lastInvite: null,
}));
