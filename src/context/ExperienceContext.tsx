import React, { createContext, useState, useCallback } from 'react';
import type { ChapterId, ExperienceContextType } from '../types/experience';

const CHAPTERS: ChapterId[] = ['intro', 'scanner', 'challenge', 'cake', 'gift', 'final'];

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>('intro');
  
  const getParam = (name: string, fallback: string): string => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get(name)?.trim() || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [recipientName, setRecipientName] = useState(() => getParam('to', 'Birthday Star'));
  const [senderName, setSenderName] = useState(() => getParam('from', 'Someone Special'));
  const [theme] = useState('elegant');

  const setNames = useCallback((recipient: string, sender: string) => {
    setRecipientName(recipient.trim() || 'Birthday Star');
    setSenderName(sender.trim() || 'Someone Special');
  }, []);

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
        recipientName,
        senderName,
        theme,
        currentChapter,
        nextChapter,
        prevChapter,
        resetExperience,
        setChapter,
        setNames,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};
