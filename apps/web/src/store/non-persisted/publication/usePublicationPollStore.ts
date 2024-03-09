import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface PublicationPollState {
  pollConfig: {
    length: number;
    options: string[];
  };
  resetPollConfig: () => void;
  setPollConfig: (pollConfig: { length: number; options: string[] }) => void;
  setShowPollEditor: (showPollEditor: boolean) => void;
  showPollEditor: boolean;
}

const store = create<PublicationPollState>((set) => ({
  pollConfig: { length: 7, options: ['', ''] },
  resetPollConfig: () =>
    set(() => ({ pollConfig: { length: 1, options: ['', ''] } })),
  setPollConfig: (pollConfig) => set(() => ({ pollConfig })),
  setShowPollEditor: (showPollEditor) => set(() => ({ showPollEditor })),
  showPollEditor: false
}));

export const usePublicationPollStore = createTrackedSelector(store);
