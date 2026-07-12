export type ChapterId =
  | 'intro'
  | 'scanner'
  | 'challenge'
  | 'cake'
  | 'gift'
  | 'final';

export interface ExperienceState {
  recipientName: string;
  senderName: string;
  theme: string;
  currentChapter: ChapterId;
}

export interface ExperienceContextType extends ExperienceState {
  nextChapter: () => void;
  prevChapter: () => void;
  resetExperience: () => void;
  setChapter: (chapter: ChapterId) => void;
  setNames: (recipient: string, sender: string) => void;
}
