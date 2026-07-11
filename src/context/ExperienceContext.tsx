import React, { createContext, useState, useCallback } from 'react';
import type { ChapterId, ExperienceContextType } from '../types/experience';

const CHAPTERS: ChapterId[] = ['intro', 'scanner', 'challenge', 'cake', 'gift', 'final'];

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>('intro');
  
  // Hardcoded details for the MVP
  const [state] = useState({
    recipientName: 'Birthday Star',
    senderName: 'Your Friend',
    theme: 'elegant',
  });

  const nextChapter = useCallback(() => {
    const currentIndex = CHAPTERS.indexOf(currentChapter);
    if (currentIndex < CHAPTERS.length - 1) {
      setCurrentChapter(CHAPTERS[currentIndex + 1]);
    }
  }, [currentChapter]);

  const prevChapter = useCallback(() => {
    const currentIndex = CHAPTERS.indexOf(currentChapter);
    if (currentIndex > 0) {
      setCurrentChapter(CHAPTERS[currentIndex - 1]);
    }
  }, [currentChapter]);

  const resetExperience = useCallback(() => {
    setCurrentChapter('intro');
  }, []);

  const setChapter = useCallback((chapter: ChapterId) => {
    if (CHAPTERS.includes(chapter)) {
      setCurrentChapter(chapter);
    }
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        ...state,
        currentChapter,
        nextChapter,
        prevChapter,
        resetExperience,
        setChapter,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};
