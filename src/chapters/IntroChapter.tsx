import React from 'react';
import { useExperience } from '../hooks/useExperience';

export const IntroChapter: React.FC = () => {
  const { recipientName, senderName, nextChapter } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto h-full">
      <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-semibold">
        A Special Invitation
      </span>
      <h1 className="font-serif text-5xl md:text-6xl font-light mb-6 tracking-tight leading-tight">
        Hello,{' '}
        <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-indigo-300 bg-clip-text text-transparent font-medium">
          {recipientName}
        </span>
      </h1>
      <p className="text-zinc-400 text-base md:text-lg mb-12 font-light leading-relaxed">
        {senderName} has prepared a cinematic, interactive surprise just for you. 
        Take a moment to settle in, relax, and step inside.
      </p>
      <button
        onClick={nextChapter}
        className="px-8 py-3.5 bg-white text-black font-medium rounded-full text-sm tracking-wide shadow-lg hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        Begin the Journey
      </button>
    </div>
  );
};
