import React from 'react';
import { useExperience } from '../hooks/useExperience';
import type { ChapterId } from '../types/experience';

interface LayoutProps {
  children: React.ReactNode;
}

const CHAPTERS: ChapterId[] = ['intro', 'scanner', 'challenge', 'cake', 'gift', 'final'];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentChapter, prevChapter, nextChapter } = useExperience();
  const currentIndex = CHAPTERS.indexOf(currentChapter);

  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-[#030303] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 select-none">
      {/* Decorative Elegant Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-950/10 blur-[120px] pointer-events-none" />
      
      {/* Header / Brand */}
      <header className="w-full py-6 px-8 flex justify-between items-center z-10">
        <span className="font-serif italic text-lg tracking-wider bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          unwrap.
        </span>
      </header>

      {/* Main Experience Area */}
      <main className="flex-1 w-full relative z-10 flex items-center justify-center overflow-hidden">
        {children}
      </main>

      {/* Footer / Minimal Debug Navigation Controls */}
      <footer className="w-full py-6 px-8 flex justify-between items-center z-10">
        <div />
        
        {/* Navigation helpers for testing */}
        <div className="flex items-center space-x-4">
          {currentIndex > 0 && (
            <button
              onClick={prevChapter}
              className="text-xs text-zinc-550 hover:text-zinc-300 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>←</span> <span>Back</span>
            </button>
          )}
          {currentIndex < CHAPTERS.length - 1 && (
            <button
              onClick={nextChapter}
              className="text-xs text-zinc-550 hover:text-zinc-300 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>Next</span> <span>→</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
