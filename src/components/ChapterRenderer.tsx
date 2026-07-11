import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../hooks/useExperience';
import { CHAPTER_COMPONENTS } from '../chapters';

export const ChapterRenderer: React.FC = () => {
  const { currentChapter } = useExperience();
  const ActiveChapter = CHAPTER_COMPONENTS[currentChapter];

  if (!ActiveChapter) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentChapter}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1], // Custom premium easeOutExpo
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <ActiveChapter />
      </motion.div>
    </AnimatePresence>
  );
};
