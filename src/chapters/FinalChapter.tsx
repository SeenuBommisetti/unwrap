import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const FinalChapter: React.FC = () => {
  const { recipientName, senderName, resetExperience } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        Chapter 05
      </span>
      <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6 tracking-tight leading-tight bg-gradient-to-r from-amber-200 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
        Happy Birthday, {recipientName}!
      </h1>
      <p className="text-zinc-400 text-base md:text-lg mb-12 font-light leading-relaxed">
        May this year bring you endless joy, peace, and beautiful moments. 
        Thank you for being such a wonderful part of our lives.
      </p>
      
      <div className="text-sm font-serif italic text-zinc-500 mb-12">
        With love, <span className="text-zinc-350 not-italic font-sans font-semibold ml-1">{senderName}</span>
      </div>

      <button
        onClick={resetExperience}
        className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium rounded-full text-sm tracking-wide shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Replay Experience
      </button>
    </div>
  );
};
